
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  LinearProgress
} from '@mui/material';
import { PlayCircle, Book, CheckCircle } from '@mui/icons-material';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string;
  progress?: number;
}

export const CourseAccess: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('cursos')
        .select('id, title, description, image_url')
        .eq('is_published', true)
        .eq('is_public', true);

      if (error) throw error;

      setCourses(data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseAccess = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  if (loading) {
    return (
      <Card className="dark:bg-gray-800">
        <CardContent>
          <Typography>Carregando cursos...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:bg-gray-800">
      <CardContent>
        <Typography variant="h6" gutterBottom className="dark:text-white">
          Seus Cursos
        </Typography>

        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card className="dark:bg-gray-700 h-full">
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <PlayCircle className="text-blue-500" />
                    <Typography variant="h6" className="dark:text-white text-sm">
                      {course.title}
                    </Typography>
                  </Box>

                  <Typography 
                    variant="body2" 
                    color="textSecondary" 
                    className="dark:text-gray-300 mb-3"
                    sx={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {course.description}
                  </Typography>

                  {course.progress !== undefined && (
                    <Box mb={2}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="caption" className="dark:text-gray-300">
                          Progresso
                        </Typography>
                        <Typography variant="caption" className="dark:text-gray-300">
                          {course.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={course.progress} 
                        className="rounded"
                      />
                    </Box>
                  )}

                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    onClick={() => handleCourseAccess(course.id)}
                    className="bg-blue-600 hover:bg-blue-700"
                    startIcon={<Book />}
                  >
                    Acessar Curso
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {courses.length === 0 && (
          <Typography variant="body2" color="textSecondary" className="dark:text-gray-300">
            Nenhum curso disponível no momento
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
