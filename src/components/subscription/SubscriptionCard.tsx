
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { CheckCircle, Cancel, Warning } from '@mui/icons-material';
import { Subscription } from '@/types/subscription';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionCardProps {
  subscription: Subscription | null;
  onUpdate: () => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="text-green-500" />;
      case 'canceled':
        return <Cancel className="text-red-500" />;
      default:
        return <Warning className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'canceled':
        return 'error';
      case 'past_due':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: { priceId: 'price_1234567890' } // Substitua pelo ID real do preço no Stripe
      });

      if (error) throw error;

      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '');
      if (stripe && data.sessionId) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      }
    } catch (err) {
      setError('Erro ao processar assinatura. Tente novamente.');
      console.error('Subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription?.stripe_subscription_id) return;

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('cancel-subscription', {
        body: { subscriptionId: subscription.stripe_subscription_id }
      });

      if (error) throw error;

      onUpdate();
    } catch (err) {
      setError('Erro ao cancelar assinatura. Tente novamente.');
      console.error('Cancel subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!subscription) {
    return (
      <Card className="dark:bg-gray-800">
        <CardContent>
          <Typography variant="h6" gutterBottom className="dark:text-white">
            Assine Agora
          </Typography>
          <Typography variant="body2" color="textSecondary" className="dark:text-gray-300 mb-4">
            Acesse todos os cursos com uma assinatura única
          </Typography>
          
          <Box className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg text-white mb-4">
            <Typography variant="h4" fontWeight="bold">
              R$ 97,00
            </Typography>
            <Typography variant="body2">
              Acesso vitalício a todos os cursos
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleSubscribe}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? <CircularProgress size={24} /> : 'Assinar Agora'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:bg-gray-800">
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          {getStatusIcon(subscription.status)}
          <Typography variant="h6" className="dark:text-white">
            Minha Assinatura
          </Typography>
          <Chip 
            label={subscription.status.toUpperCase()} 
            color={getStatusColor(subscription.status) as any}
            size="small"
          />
        </Box>

        <Typography variant="body2" color="textSecondary" className="dark:text-gray-300 mb-2">
          Plano: {subscription.plan_name || 'Acesso Completo'}
        </Typography>

        {subscription.current_period_end && (
          <Typography variant="body2" color="textSecondary" className="dark:text-gray-300 mb-4">
            Próxima renovação: {new Date(subscription.current_period_end).toLocaleDateString('pt-BR')}
          </Typography>
        )}

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        {subscription.status === 'active' && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleCancelSubscription}
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Cancelar Assinatura'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
