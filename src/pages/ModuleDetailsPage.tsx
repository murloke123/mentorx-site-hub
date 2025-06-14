
import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';

const ModuleDetailsPage = () => {
  const { courseId, moduleId } = useParams();

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" gutterBottom>
        Detalhes do Módulo
      </Typography>
      <Typography variant="body1">
        Curso ID: {courseId}, Módulo ID: {moduleId}
      </Typography>
    </Container>
  );
};

export default ModuleDetailsPage;
