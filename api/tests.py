from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from rest_framework import status
from decimal import Decimal
from .models import Product, Transaction

class VendingMachineTests(TestCase):
    def setUp(self):
        # Create test user
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')

        # Create test product
        self.product = Product.objects.create(
            name='Test Cola',
            price=Decimal('2.50'),
            quantity=10
        )

    def test_product_list(self):
        """Test retrieving product list"""
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], 'Test Cola')

    def test_product_purchase(self):
        """Test purchasing a product"""
        response = self.client.post(
            f'/api/products/{self.product.id}/purchase/',
            {'quantity': 2, 'payment_method': 'APP'}
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Check product quantity was updated
        self.product.refresh_from_db()
        self.assertEqual(self.product.quantity, 8)

        # Check transaction was created
        transaction = Transaction.objects.first()
        self.assertIsNotNone(transaction)
        self.assertEqual(transaction.quantity, 2)
        self.assertEqual(transaction.total_amount, Decimal('5.00'))

    def test_purchase_insufficient_stock(self):
        """Test purchasing more items than available"""
        response = self.client.post(
            f'/api/products/{self.product.id}/purchase/',
            {'quantity': 11, 'payment_method': 'APP'}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_transaction_history(self):
        """Test retrieving transaction history"""
        # Create a transaction
        Transaction.objects.create(
            product=self.product,
            user=self.user,
            quantity=1,
            total_amount=self.product.price,
            payment_method='APP',
            status='COMPLETED'
        )

        response = self.client.get('/api/transactions/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['quantity'], 1)
