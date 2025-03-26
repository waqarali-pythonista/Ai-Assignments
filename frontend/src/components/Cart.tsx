import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { useCart } from '../contexts/CartContext';

interface CartItemType {
  product: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image_source?: string;
  };
  quantity: number;
}

export const Cart: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'APP' | 'CASH'>('APP');
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const purchaseMutation = useMutation({
    mutationFn: async (item: { productId: number; quantity: number }) => {
      return apiService.purchaseProduct(item.productId, item.quantity, paymentMethod);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const handleCheckout = async () => {
    try {
      setError(null);
      // Purchase each item in the cart
      for (const item of cartItems) {
        await purchaseMutation.mutateAsync({
          productId: item.product.id,
          quantity: item.quantity,
        });
      }
      clearCart();
      setIsCheckoutOpen(false);
    } catch (error) {
      console.error('Checkout failed:', error);
      setError(error instanceof Error ? error.message : 'Checkout failed');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total: number, item: CartItemType) => total + Number(item.product.price) * item.quantity,
      0
    );
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5">Your cart is empty</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Shopping Cart
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Paper sx={{ width: '100%', mb: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item: CartItemType) => (
                  <TableRow key={item.product.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {item.product.image_source && (
                          <img
                            src={item.product.image_source}
                            alt={item.product.name}
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: 'cover',
                              marginRight: 16,
                              borderRadius: 4,
                            }}
                          />
                        )}
                        {item.product.name}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      ${Number(item.product.price).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.quantity}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      ${(Number(item.product.price) * item.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <Typography variant="h6">Total:</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6">
                      ${calculateTotal().toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsCheckoutOpen(true)}
              size="large"
            >
              Proceed to Checkout
            </Button>
          </Box>
        </Paper>
      </Box>

      <Dialog open={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)}>
        <DialogTitle>Checkout</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Payment Method</FormLabel>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as 'APP' | 'CASH')}
              >
                <FormControlLabel
                  value="APP"
                  control={<Radio />}
                  label="App Payment"
                />
                <FormControlLabel
                  value="CASH"
                  control={<Radio />}
                  label="Cash Payment"
                />
              </RadioGroup>
            </FormControl>
          </Box>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Total Amount: ${calculateTotal().toFixed(2)}
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCheckoutOpen(false)}>Cancel</Button>
          <Button onClick={handleCheckout} variant="contained" color="primary">
            Complete Purchase
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}; 