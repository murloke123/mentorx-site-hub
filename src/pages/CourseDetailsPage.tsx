
import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';

const CourseDetailsPage = () => {
  const { courseId } = useParams();

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" gutterBottom>
        Detalhes do Curso
      </Typography>
      <Typography variant="body1">
        Curso ID: {courseId}
      </Typography>
    </Container>
  );
};

export default CourseDetailsPage;
