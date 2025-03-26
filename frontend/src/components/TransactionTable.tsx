import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { Transaction } from '../services/api';

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Total Amount</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell component="th" scope="row">
                {transaction.product.name}
              </TableCell>
              <TableCell align="right">{transaction.quantity}</TableCell>
              <TableCell align="right">
                ${Number(transaction.total_amount).toFixed(2)}
              </TableCell>
              <TableCell>{transaction.payment_method}</TableCell>
              <TableCell>
                <Chip
                  label={transaction.status}
                  color={getStatusColor(transaction.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                {new Date(transaction.created_at).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}; 