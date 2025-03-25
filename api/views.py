from django.shortcuts import render
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.throttling import UserRateThrottle
from django_filters.rest_framework import DjangoFilterBackend
from django.core.cache import cache
from django.db import transaction
from django.shortcuts import get_object_or_404

from .models import Product, Transaction
from .serializers import ProductSerializer, TransactionSerializer
from .forms import ProductPurchaseForm

# Create your views here.

class ProductRateThrottle(UserRateThrottle):
    rate = '100/hour'

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    throttle_classes = [ProductRateThrottle]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['name', 'price']
    search_fields = ['name']
    ordering_fields = ['name', 'price', 'quantity']

    def get_queryset(self):
        """
        Cache and return the product list
        """
        cache_key = 'product_list'
        queryset = cache.get(cache_key)
        
        if queryset is None:
            queryset = Product.objects.all()
            cache.set(cache_key, queryset, timeout=300)  # Cache for 5 minutes
        
        return queryset

    @action(detail=True, methods=['post'])
    def purchase(self, request, pk=None):
        """
        Purchase a product
        """
        product = self.get_object()
        form = ProductPurchaseForm(request.data)
        form.fields['product'].initial = product

        if not form.is_valid():
            return Response(
                {'error': form.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        quantity = form.cleaned_data['quantity']
        payment_method = form.cleaned_data['payment_method']

        if product.quantity < quantity:
            return Response(
                {'error': 'Not enough stock available'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with transaction.atomic():
                # Create transaction
                transaction_obj = Transaction.objects.create(
                    product=product,
                    user=request.user,
                    quantity=quantity,
                    payment_method=payment_method,
                    total_amount=product.price * quantity,
                    status='COMPLETED'
                )

                # Update product quantity
                product.quantity -= quantity
                product.save()

                # Clear cache
                cache.delete('product_list')

                return Response(
                    TransactionSerializer(transaction_obj).data,
                    status=status.HTTP_201_CREATED
                )

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TransactionSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['payment_method', 'status']
    ordering_fields = ['created_at', 'total_amount']

    def get_queryset(self):
        """
        Return transactions for the current user
        """
        return Transaction.objects.filter(user=self.request.user).order_by('-created_at')
