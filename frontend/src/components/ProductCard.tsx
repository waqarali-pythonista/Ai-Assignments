import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { Product } from '../services/api';

interface ProductCardProps {
  product: Product;
  onPurchase: (product: Product) => void;
  disabled?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPurchase,
  disabled = false,
}) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="140"
        image={`https://via.placeholder.com/200x140?text=${product.name}`}
        alt={product.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Price: ${Number(product.price).toFixed(2)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Available: {product.quantity}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => onPurchase(product)}
          disabled={disabled || product.quantity === 0}
        >
          Purchase
        </Button>
      </Box>
    </Card>
  );
}; 