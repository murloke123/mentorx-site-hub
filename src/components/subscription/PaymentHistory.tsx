
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
  IconButton
} from '@mui/material';
import { Receipt } from '@mui/icons-material';
import { Payment } from '@/types/subscription';

interface PaymentHistoryProps {
  payments: Payment[];
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({ payments }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'success';
      case 'failed':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency.toLowerCase() === 'brl' ? 'BRL' : currency
    }).format(amount / 100);
  };

  return (
    <Card className="dark:bg-gray-800">
      <CardContent>
        <Typography variant="h6" gutterBottom className="dark:text-white">
          Histórico de Pagamentos
        </Typography>

        {payments.length === 0 ? (
          <Typography variant="body2" color="textSecondary" className="dark:text-gray-300">
            Nenhum pagamento encontrado
          </Typography>
        ) : (
          <List>
            {payments.map((payment) => (
              <ListItem key={payment.id} className="px-0">
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" className="dark:text-white">
                        {formatCurrency(payment.amount, payment.currency)}
                      </Typography>
                      <Chip
                        label={payment.status}
                        color={getStatusColor(payment.status) as any}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption" className="dark:text-gray-300">
                      {new Date(payment.created_at).toLocaleDateString('pt-BR')}
                    </Typography>
                  }
                />
                {payment.invoice_url && (
                  <IconButton
                    size="small"
                    onClick={() => window.open(payment.invoice_url, '_blank')}
                    className="dark:text-gray-300"
                  >
                    <Receipt />
                  </IconButton>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};
