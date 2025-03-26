import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Stack,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, Product, User, PaginatedResponse } from '../services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export const Admin = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    quantity: '',
    image_url: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const { data: productsData } = useQuery<PaginatedResponse<Product>>({
    queryKey: ['products'],
    queryFn: () => apiService.getProducts(1),
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => apiService.getUsers(),
  });

  const products = productsData?.results || [];

  const addProductMutation = useMutation({
    mutationFn: apiService.addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsAddProductOpen(false);
      setNewProduct({ name: '', price: '', quantity: '', image_url: '' });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: apiService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleAddProduct = async () => {
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('quantity', newProduct.quantity);
    
    if (selectedFile) {
      formData.append('image', selectedFile);
    } else if (newProduct.image_url) {
      formData.append('image_url', newProduct.image_url);
    }

    addProductMutation.mutate(formData);
  };

  const formatPrice = (price: number | string) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `$${numericPrice.toFixed(2)}`;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Products" />
            <Tab label="Users" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                onClick={() => setIsAddProductOpen(true)}
              >
                Add Product
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product: Product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{formatPrice(product.price)}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => deleteProductMutation.mutate(product.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users?.map((user: { id: number; username: string; email: string; is_staff: boolean }) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.is_staff ? 'Admin' : 'User'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Paper>
      </Box>

      <Dialog open={isAddProductOpen} onClose={() => setIsAddProductOpen(false)}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={newProduct.quantity}
            onChange={(e) =>
              setNewProduct({ ...newProduct, quantity: e.target.value })
            }
          />
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Product Image
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                label="Image URL"
                fullWidth
                value={newProduct.image_url}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, image_url: e.target.value })
                }
                disabled={!!selectedFile}
              />
              <input
                type="file"
                accept="image/*"
                hidden
                ref={fileInputRef}
                onChange={handleFileSelect}
              />
              <IconButton 
                color="primary" 
                onClick={() => fileInputRef.current?.click()}
                disabled={!!newProduct.image_url}
              >
                <PhotoCamera />
              </IconButton>
            </Stack>
            {selectedFile && (
              <Typography variant="caption" display="block">
                Selected file: {selectedFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setIsAddProductOpen(false);
            setSelectedFile(null);
            setNewProduct({ name: '', price: '', quantity: '', image_url: '' });
          }}>
            Cancel
          </Button>
          <Button onClick={handleAddProduct} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}; 