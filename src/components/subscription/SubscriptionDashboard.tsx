
import React from 'react';
import {
  Container,
  Typography,
  Grid2 as Grid,
  Box
} from '@mui/material';
import { SubscriptionCard } from './SubscriptionCard';
import { PaymentHistory } from './PaymentHistory';
import { CourseAccess } from './CourseAccess';
import { useAuth } from '@/contexts/AuthContext';

export const SubscriptionDashboard: React.FC = () => {
  const { user } = useAuth();

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
          <Grid xs={12} md={8}>
            <SubscriptionCard />
            <Box mt={4}>
              <CourseAccess />
            </Box>
          </Grid>
          
          <Grid xs={12} md={4}>
            <PaymentHistory />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
