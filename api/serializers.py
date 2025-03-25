from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, Transaction

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class ProductSerializer(serializers.ModelSerializer):
    image_source = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'quantity', 'image', 'image_url', 'image_source', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_image_source(self, obj):
        return obj.image_source

class TransactionSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = Transaction
        fields = [
            'id', 'product', 'quantity', 'total_amount',
            'payment_method', 'status', 'created_at'
        ] 