
import React, { useEffect } from 'react';
import { Container, Typography, Box, Button, Card, CardContent } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const SubscriptionSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar para o dashboard após 5 segundos
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Container maxWidth="md" className="py-16">
      <Card className="text-center dark:bg-gray-800">
        <CardContent className="py-16">
          <CheckCircle className="text-green-500 mb-4" style={{ fontSize: 80 }} />
          
          <Typography variant="h4" gutterBottom className="dark:text-white">
            Assinatura Confirmada!
          </Typography>
          
          <Typography variant="body1" color="textSecondary" className="dark:text-gray-300 mb-6">
            Parabéns! Sua assinatura foi processada com sucesso. 
            Agora você tem acesso completo a todos os nossos cursos.
          </Typography>

          <Box className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg text-white mb-6">
            <Typography variant="h6" gutterBottom>
              Bem-vindo à nossa plataforma!
            </Typography>
            <Typography variant="body2">
              Explore todos os cursos disponíveis e comece sua jornada de aprendizado
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/subscription')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Ir para Meu Dashboard
          </Button>

          <Typography variant="caption" display="block" className="mt-4 dark:text-gray-400">
            Você será redirecionado automaticamente em alguns segundos
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};
