
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
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
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'canceled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusVariant = (status?: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'canceled':
        return 'destructive';
      case 'past_due':
        return 'secondary';
      default:
        return 'outline';
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
        <CardHeader>
          <CardTitle className="dark:text-white">
            Assine Agora
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Acesse todos os cursos com uma assinatura única
          </p>
          
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg text-white mb-4">
            <h3 className="text-2xl font-bold">
              R$ 97,00
            </h3>
            <p className="text-sm opacity-90">
              Acesso vitalício a todos os cursos
            </p>
          </div>

          {error && (
            <Alert className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            size="lg"
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              'Assinar Agora'
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:bg-gray-800">
      <CardHeader>
        <div className="flex items-center gap-3">
          {getStatusIcon(subscription.status)}
          <CardTitle className="dark:text-white">
            Minha Assinatura
          </CardTitle>
          <Badge variant={getStatusVariant(subscription.status)}>
            {subscription.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Plano: {subscription.plan_name || 'Acesso Completo'}
        </p>

        {subscription.current_period_end && (
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Próxima renovação: {new Date(subscription.current_period_end).toLocaleDateString('pt-BR')}
          </p>
        )}

        {error && (
          <Alert className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {subscription.status === 'active' && (
          <Button
            variant="outline"
            onClick={handleCancelSubscription}
            disabled={loading}
            className="w-full text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Cancelando...
              </>
            ) : (
              'Cancelar Assinatura'
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
