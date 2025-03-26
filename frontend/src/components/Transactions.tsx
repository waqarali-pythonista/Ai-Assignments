import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Pagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
  Fade,
  Zoom,
  useTheme,
  Card,
  CardContent,
  Tooltip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Timeline } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, Transaction, PaginatedResponse } from '../services/api';

export const Transactions: React.FC = () => {
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [editQuantity, setEditQuantity] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<PaginatedResponse<Transaction>>({
    queryKey: ['transactions', page],
    queryFn: () => apiService.getTransactions(page),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; quantity: number }) =>
      apiService.updateTransaction(data.id, data.quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setEditQuantity(transaction.quantity.toString());
    setEditDialog(true);
  };

  const handleCloseDialog = () => {
    setEditDialog(false);
    setSelectedTransaction(null);
    setEditQuantity('');
  };

  const handleUpdate = () => {
    if (selectedTransaction && editQuantity) {
      updateMutation.mutate({
        id: selectedTransaction.id,
        quantity: parseInt(editQuantity),
      });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'FAILED':
        return 'error';
      default:
        return 'default';
    }
  };

  const transactions = data?.results || [];
  const totalPages = Math.ceil((data?.count || 0) / 6);

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
          Error loading transactions: {error instanceof Error ? error.message : 'Unknown error'}
        </Alert>
      </Box>
    );
  }

  if (transactions.length === 0) {
    return (
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="h6">No transactions found</Typography>
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
            background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
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
              <Timeline sx={{ fontSize: 40, opacity: 0.9 }} />
              <Box>
                <Typography variant="h4" gutterBottom fontWeight="500">
                  Transaction History
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  Manage and track your purchases
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Zoom in timeout={500}>
          <TableContainer 
            component={Paper} 
            elevation={3}
            sx={{ 
              borderRadius: 3,
              overflow: 'hidden',
              '& .MuiTableCell-root': {
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
              background: theme.palette.background.paper,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ 
                  background: 'linear-gradient(45deg, #f5f5f5 0%, #fafafa 100%)',
                }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.95rem' }}>Product</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.95rem' }}>Quantity</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.95rem' }}>Total Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.95rem' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.95rem' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.95rem' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction, index) => (
                  <Fade in timeout={300 + index * 100}>
                    <TableRow 
                      key={transaction.id}
                      sx={{ 
                        '&:hover': { 
                          bgcolor: 'action.hover',
                          transform: 'scale(1.002)',
                          transition: 'all 0.3s ease',
                        },
                      }}
                    >
                      <TableCell>
                        <Typography fontWeight="500">{transaction.product.name}</Typography>
                      </TableCell>
                      <TableCell>{transaction.quantity}</TableCell>
                      <TableCell>
                        <Typography color="primary.main" fontWeight="600">
                          ${Number(transaction.total_amount).toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(transaction.created_at).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.status}
                          color={getStatusColor(transaction.status)}
                          size="small"
                          sx={{ 
                            fontWeight: 500,
                            minWidth: 85,
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Edit Transaction" arrow>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(transaction)}
                            sx={{ 
                              mr: 1,
                              transition: 'all 0.2s ease',
                              '&:hover': { 
                                bgcolor: 'primary.light',
                                color: 'primary.contrastText',
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Transaction" arrow>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(transaction.id)}
                            sx={{ 
                              transition: 'all 0.2s ease',
                              '&:hover': { 
                                bgcolor: 'error.light',
                                color: 'error.contrastText',
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  </Fade>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Zoom>

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

        <Dialog 
          open={editDialog} 
          onClose={handleCloseDialog}
          TransitionComponent={Zoom}
          PaperProps={{
            sx: {
              borderRadius: 3,
              minWidth: 400,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
            },
          }}
        >
          <DialogTitle sx={{ pb: 1, background: 'transparent' }}>
            <Typography variant="h6" fontWeight="500">
              Edit Transaction
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                label="Quantity"
                type="number"
                value={editQuantity}
                onChange={(e) => setEditQuantity(e.target.value)}
                fullWidth
                inputProps={{ min: 1 }}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      '& fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  },
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={handleCloseDialog}
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                minWidth: 100,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                },
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate} 
              variant="contained" 
              color="primary"
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                minWidth: 100,
                transition: 'all 0.2s ease',
                background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(25,118,210,0.25)',
                },
              }}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};