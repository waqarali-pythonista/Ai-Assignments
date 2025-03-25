# Vending Machine Application

A modern web-based vending machine application built with Django and React. This application allows users to browse products, make purchases, and manage inventory through an admin interface.

## Features

### User Features
- User authentication (login/signup)
- Browse products with pagination
- Add products to cart
- Adjust quantities in cart
- Checkout with multiple payment methods (App Payment/Cash)
- View transaction history
- Responsive design with modern UI

### Admin Features
- Secure admin interface
- Product management (CRUD operations)
- Transaction monitoring
- User management
- Image upload support for products
- Stock management

## Tech Stack

### Backend
- Django 4.2
- Django REST Framework
- Django CORS Headers
- Django Filter
- Token Authentication
- PostgreSQL Database

### Frontend
- React 18
- TypeScript
- Material-UI (MUI)
- React Query
- React Router
- Context API for state management

## Prerequisites

- Python 3.8+
- Node.js 14+
- PostgreSQL
- pip (Python package manager)
- npm (Node package manager)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vending-machine
```

2. Set up the backend:
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run the development server
python manage.py runserver
```

3. Set up the frontend:
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgres://user:password@localhost:5432/dbname
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/token/` - Login
- `POST /api/signup/` - User registration

### Products
- `GET /api/products/` - List all products (paginated)
- `POST /api/products/` - Create new product (admin only)
- `GET /api/products/{id}/` - Get product details
- `PUT /api/products/{id}/` - Update product (admin only)
- `DELETE /api/products/{id}/` - Delete product (admin only)
- `POST /api/products/{id}/purchase/` - Purchase product

### Transactions
- `GET /api/transactions/` - List user's transactions
- `GET /api/transactions/{id}/` - Get transaction details
- `PATCH /api/transactions/{id}/` - Update transaction (admin only)
- `DELETE /api/transactions/{id}/` - Delete transaction (admin only)

## Frontend Routes

- `/` - Products page
- `/login` - Login page
- `/signup` - Registration page
- `/cart` - Shopping cart
- `/transactions` - Transaction history
- `/admin` - Admin dashboard (admin only)

## Development

### Backend Development
```bash
# Run tests
python manage.py test

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Run development server
python manage.py runserver
```

### Frontend Development
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Deployment

### Backend Deployment
1. Set up a production server (e.g., Ubuntu)
2. Install required system packages
3. Set up PostgreSQL
4. Configure environment variables
5. Set up Gunicorn and Nginx
6. Deploy using your preferred method (e.g., Docker, Heroku)

### Frontend Deployment
1. Build the frontend:
```bash
npm run build
```
2. Deploy the build folder to your web server
3. Configure Nginx to serve the static files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository or contact the maintainers. 