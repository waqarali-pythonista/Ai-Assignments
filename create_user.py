import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vending_machine.settings')
django.setup()

from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

# Create a superuser
username = 'admin'
password = 'admin123'

try:
    user = User.objects.create_superuser(username=username, email='admin@example.com', password=password)
    # Create token for the user
    token = Token.objects.create(user=user)
    print(f'Superuser created successfully!')
    print(f'Username: {username}')
    print(f'Password: {password}')
    print(f'Token: {token.key}')
except Exception as e:
    print(f'Error creating superuser: {str(e)}') 