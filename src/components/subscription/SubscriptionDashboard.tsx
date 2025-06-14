
import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { subscriptionService } from '@/services/subscriptionService';
import { Subscription, Payment } from '@/types/subscription';
import { SubscriptionCard } from './SubscriptionCard';
import { PaymentHistory } from './PaymentHistory';
import { CourseAccess } from './CourseAccess';

export const SubscriptionDashboard: React.FC = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubscriptionData();
    }
  }, [user]);

  const loadSubscriptionData = async () => {
    if (!user) return;

    setLoading(true);
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

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography>Carregando...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" gutterBottom className="dark:text-white">
        Minha Assinatura
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <SubscriptionCard subscription={subscription} onUpdate={loadSubscriptionData} />
          {subscription?.status === 'active' && (
            <Box mt={4}>
              <CourseAccess />
            </Box>
          )}
        </Grid>
        
        <Grid item xs={12} md={4}>
          <PaymentHistory payments={payments} />
        </Grid>
      </Grid>
    </Container>
  );
};
