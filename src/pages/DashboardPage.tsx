
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';

const DashboardPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography>Carregando...</Typography>
        </Box>
      </Container>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1">
        Bem-vindo, {user.email}!
      </Typography>
    </Container>
  );
};

export default DashboardPage;
