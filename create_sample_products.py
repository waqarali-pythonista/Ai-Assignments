import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vending_machine.settings')
django.setup()

from api.models import Product

def create_sample_products():
    products = [
        {
            'name': 'Coca Cola',
            'price': 2.50,
            'quantity': 10,
        },
        {
            'name': 'Pepsi',
            'price': 2.00,
            'quantity': 15,
        },
        {
            'name': 'Water',
            'price': 1.50,
            'quantity': 20,
        },
        {
            'name': 'Coffee',
            'price': 3.00,
            'quantity': 8,
        },
        {
            'name': 'Tea',
            'price': 2.00,
            'quantity': 12,
        },
    ]

    for product_data in products:
        Product.objects.get_or_create(
            name=product_data['name'],
            defaults={
                'price': product_data['price'],
                'quantity': product_data['quantity'],
            }
        )

if __name__ == '__main__':
    create_sample_products()
    print('Sample products created successfully!') 