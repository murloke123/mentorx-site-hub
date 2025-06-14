
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Play, BookOpen } from 'lucide-react';

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
      <CardHeader>
        <CardTitle className="dark:text-white">
          Meus Cursos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <Card key={course.id} className="dark:bg-gray-700">
              <CardContent className="p-4">
                <div className="mb-3">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
                
                <h3 className="font-semibold text-lg dark:text-white mb-2">
                  {course.title}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {course.description}
                </p>

                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm dark:text-gray-300">
                      Progresso: {course.progress}%
                    </span>
                    <span className="text-sm dark:text-gray-300">
                      {course.completedLessons}/{course.totalLessons}
                    </span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Play className="w-4 h-4" />
                    Continuar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <BookOpen className="w-4 h-4" />
                    Módulos
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              Nenhum curso disponível no momento
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
