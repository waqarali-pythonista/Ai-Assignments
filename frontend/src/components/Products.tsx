import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Pagination,
  Fade,
  IconButton,
  Container,
  Badge,
} from '@mui/material';
import { 
  ShoppingCart as CartIcon,
  Store as StoreIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { apiService, Product, PaginatedResponse } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

export const Products: React.FC = () => {
  const [page, setPage] = useState(1);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const { addToCart, getCartItemCount } = useCart();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery<PaginatedResponse<Product>>({
    queryKey: ['products', page],
    queryFn: () => apiService.getProducts(page),
  });

  const handleQuantityChange = (productId: number, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta),
    }));
  };

  const handleAddToCart = (productId: number) => {
    const product = data?.results.find((p) => p.id === productId);
    if (product) {
      const quantity = quantities[productId] || 1;
      addToCart(product, quantity);
    }
  };

  const products = data?.results || [];
  const totalPages = Math.ceil((data?.count || 0) / 6);
  const cartItemCount = getCartItemCount();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">
          Error loading products: {error instanceof Error ? error.message : 'Unknown error'}
        </Alert>
      </Box>
    );
  }

  return (
    <Fade in timeout={500}>
      <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
        <Card 
          elevation={0} 
          sx={{ 
            mb: 4, 
            background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
            color: 'white', 
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)',
            }
          }}
        >
          <CardContent sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <StoreIcon sx={{ fontSize: 40, opacity: 0.9 }} />
              <Box>
                <Typography variant="h4" gutterBottom fontWeight="500">
                  Available Products
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  Browse and purchase your favorite items
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Container maxWidth="lg">
          <Box sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
              <Typography variant="h4" component="h1">
                Products
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={
                  <Badge badgeContent={cartItemCount} color="error">
                    <CartIcon />
                  </Badge>
                }
                onClick={() => navigate('/cart')}
              >
                View Cart
              </Button>
            </Box>
            <Grid container spacing={4}>
              {products.map((product) => (
                <Grid item key={product.id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.image_url || 'https://via.placeholder.com/200'}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {product.name}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        ${Number(product.price).toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Stock: {product.quantity}
                      </Typography>
                      <Box
                        sx={{
                          mt: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(product.id, -1)
                            }
                            disabled={quantities[product.id] <= 1}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography sx={{ mx: 2 }}>
                            {quantities[product.id] || 1}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(product.id, 1)
                            }
                            disabled={
                              (quantities[product.id] || 1) >= product.quantity
                            }
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                        <Button
                          variant="contained"
                          onClick={() => handleAddToCart(product.id)}
                          disabled={product.quantity === 0}
                        >
                          Add to Cart
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>

        {totalPages > 1 && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                  },
                },
              }}
            />
          </Box>
        )}
      </Box>
    </Fade>
  );
}; 