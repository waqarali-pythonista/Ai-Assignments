from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.throttling import UserRateThrottle
from django_filters.rest_framework import DjangoFilterBackend
from django.core.cache import cache
from django.db import transaction

from ..models import Product, Transaction
from ..serializers import ProductSerializer, TransactionSerializer

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
    ordering = ['name']  # Default ordering

    def get_queryset(self):
        """
        Cache and return the product list
        """
        page = self.request.query_params.get("page", 1)
        cache_key = f'product_list_page_{page}'
        queryset = cache.get(cache_key)
        
        if queryset is None:
            queryset = super().get_queryset()
            cache.set(cache_key, queryset, timeout=300)  # Cache for 5 minutes
        
        return queryset

    def invalidate_cache(self):
        """
        Invalidate all product list cache pages
        """
        # Get the total number of pages
        total_items = Product.objects.count()
        pages = (total_items + 5) // 6  # 6 items per page, rounded up

        # Invalidate cache for each page
        for page in range(1, pages + 1):
            cache_key = f'product_list_page_{page}'
            cache.delete(cache_key)

    @action(detail=True, methods=['post'])
    def purchase(self, request, pk=None):
        """
        Purchase a product
        """
        try:
            product = self.get_object()
            quantity = int(request.data.get('quantity', 0))

            if quantity <= 0:
                return Response(
                    {'error': 'Quantity must be greater than 0'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if quantity > product.quantity:
                return Response(
                    {'error': 'Not enough stock available'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            with transaction.atomic():
                # Create transaction
                transaction_obj = Transaction.objects.create(
                    product=product,
                    user=request.user,
                    quantity=quantity,
                    payment_method='APP',
                    total_amount=product.price * quantity,
                    status='COMPLETED'
                )

                # Update product quantity
                product.quantity -= quantity
                product.save()

                # Invalidate cache
                self.invalidate_cache()

                return Response(
                    TransactionSerializer(transaction_obj).data,
                    status=status.HTTP_201_CREATED
                )

        except ValueError:
            return Response(
                {'error': 'Invalid quantity'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            ) 