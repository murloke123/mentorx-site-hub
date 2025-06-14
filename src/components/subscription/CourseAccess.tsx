
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  LinearProgress
} from '@mui/material';
import { PlayArrow, MenuBook, CheckCircle } from '@mui/icons-material';

export const CourseAccess: React.FC = () => {
  // Mock data - replace with real data from your course service
  const courses = [
    {
      id: '1',
      title: 'Curso Completo de React',
      description: 'Aprenda React do básico ao avançado',
      progress: 45,
      totalLessons: 20,
      completedLessons: 9,
      image: '/placeholder.svg'
    },
    {
      id: '2',
      title: 'JavaScript Moderno',
      description: 'ES6+, async/await, e muito mais',
      progress: 78,
      totalLessons: 15,
      completedLessons: 12,
      image: '/placeholder.svg'
    }
  ];

  return (
    <Card className="dark:bg-gray-800">
      <CardContent>
        <Typography variant="h6" gutterBottom className="dark:text-white">
          Meus Cursos
        </Typography>

        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card className="dark:bg-gray-700 h-full">
                <CardContent>
                  <Box className="mb-3">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-32 object-cover rounded"
                    />
                  </Box>
                  
                  <Typography variant="h6" className="dark:text-white mb-2">
                    {course.title}
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary" className="dark:text-gray-300 mb-2">
                    {course.description}
                  </Typography>

                  <Box className="mb-2">
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2" className="dark:text-gray-300">
                        Progresso: {course.progress}%
                      </Typography>
                      <Typography variant="body2" className="dark:text-gray-300">
                        {course.completedLessons}/{course.totalLessons}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={course.progress} 
                      className="rounded"
                    />
                  </Box>

                  <Box display="flex" gap={1} mt={2}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<PlayArrow />}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Continuar
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<MenuBook />}
                    >
                      Módulos
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {courses.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography variant="body1" color="textSecondary">
              Nenhum curso disponível no momento
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
