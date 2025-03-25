from django.core.management.base import BaseCommand
from api.models import Product
from decimal import Decimal

class Command(BaseCommand):
    help = 'Loads initial product data'

    def handle(self, *args, **kwargs):
        initial_products = [
            {'name': 'coke', 'price': Decimal('20.00'), 'quantity': 5},
            {'name': 'fanta', 'price': Decimal('15.00'), 'quantity': 3},
            {'name': 'chips', 'price': Decimal('15.00'), 'quantity': 4},
            {'name': 'snickers', 'price': Decimal('10.00'), 'quantity': 5},
        ]

        for product_data in initial_products:
            Product.objects.get_or_create(
                name=product_data['name'],
                defaults={
                    'price': product_data['price'],
                    'quantity': product_data['quantity']
                }
            )

        self.stdout.write(self.style.SUCCESS('Successfully loaded initial product data')) 