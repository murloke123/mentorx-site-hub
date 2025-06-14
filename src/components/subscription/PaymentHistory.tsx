
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Receipt } from 'lucide-react';
import { Payment } from '@/types/subscription';

interface PaymentHistoryProps {
  payments: Payment[];
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({ payments }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'pending':
        return 'secondary';
      default:
        return 'outline';
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
      <CardHeader>
        <CardTitle className="dark:text-white">
          Histórico de Pagamentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Nenhum pagamento encontrado
          </p>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium dark:text-white">
                      {formatCurrency(payment.amount, payment.currency)}
                    </span>
                    <Badge variant={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {new Date(payment.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                {payment.invoice_url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(payment.invoice_url, '_blank')}
                    className="ml-2"
                  >
                    <Receipt className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
