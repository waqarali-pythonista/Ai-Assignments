from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.core.cache import cache
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from ..models import Transaction, Product
from ..serializers import TransactionSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        transaction = self.get_object()
        
        # Get the new quantity from request data
        new_quantity = int(request.data.get('quantity', 0))
        if new_quantity <= 0:
            return Response(
                {'error': 'Quantity must be greater than 0'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate quantity difference
        quantity_diff = new_quantity - transaction.quantity

        # Check if there's enough stock
        if quantity_diff > 0:  # Only check if we're increasing the quantity
            if transaction.product.quantity < quantity_diff:
                return Response(
                    {'error': 'Not enough stock available'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Update product stock
        product = transaction.product
        product.quantity -= quantity_diff  # Will add if quantity_diff is negative
        product.save()

        # Update transaction
        transaction.quantity = new_quantity
        transaction.total_amount = new_quantity * product.price
        transaction.save()

        # Invalidate cache
        cache.delete_many([f'product_list_page_{i}' for i in range(1, 10)])

        return Response(TransactionSerializer(transaction).data)

    def destroy(self, request, *args, **kwargs):
        transaction = self.get_object()

        # Restore product quantity
        product = transaction.product
        product.quantity += transaction.quantity
        product.save()

        # Delete the transaction
        transaction.delete()

        # Invalidate cache
        cache.delete_many([f'product_list_page_{i}' for i in range(1, 10)])

        return Response(status=status.HTTP_204_NO_CONTENT) 