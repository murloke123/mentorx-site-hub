
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box
} from '@mui/material';
import { SubscriptionCard } from './SubscriptionCard';
import { PaymentHistory } from './PaymentHistory';
import { CourseAccess } from './CourseAccess';
import { useAuth } from '@/contexts/AuthContext';
import { subscriptionService } from '@/services/subscriptionService';
import { Subscription, Payment } from '@/types/subscription';

export const SubscriptionDashboard: React.FC = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user) return;
    
    try {
      const [subscriptionData, paymentsData] = await Promise.all([
        subscriptionService.getCurrentSubscription(user.id),
        subscriptionService.getPaymentHistory(user.id)
      ]);
      
      setSubscription(subscriptionData);
      setPayments(paymentsData);
    } catch (error) {
      console.error('Error loading subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  if (!user) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Typography variant="h4" gutterBottom>
          Acesso negado
        </Typography>
        <Typography variant="body1">
          Você precisa estar logado para acessar esta página.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" gutterBottom className="dark:text-white">
        Minha Assinatura
      </Typography>
      
      <Typography variant="body1" color="textSecondary" className="dark:text-gray-300 mb-6">
        Gerencie sua assinatura, acesse seus cursos e visualize seu histórico de pagamentos
      </Typography>

      <Box mb={4}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <SubscriptionCard subscription={subscription} onUpdate={loadData} />
            <Box mt={4}>
              <CourseAccess />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <PaymentHistory payments={payments} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
