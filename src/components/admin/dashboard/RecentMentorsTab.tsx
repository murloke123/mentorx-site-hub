
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, BookOpen, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertCircle, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Mentor {
  id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  courses_count: number;
  followers_count: number;
}

interface RecentMentorsTabProps {
  mentors: Mentor[];
  isLoading: boolean;
}

const RecentMentorsTab = ({ mentors, isLoading }: RecentMentorsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Mentores Recentes
        </CardTitle>
        <CardDescription>
          Últimos mentores registrados na plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-40 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : mentors.length > 0 ? (
          <div className="space-y-4">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  {mentor.avatar_url ? (
                    <img src={mentor.avatar_url} alt={mentor.full_name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <User className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{mentor.full_name || "Mentor sem nome"}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <BookOpen className="h-3 w-3 mr-1" />
                    <span>{mentor.courses_count} cursos</span>
                    <span className="mx-2">•</span>
                    <Users className="h-3 w-3 mr-1" />
                    <span>{mentor.followers_count} seguidores</span>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="pt-4">
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/mentores">Ver todos os mentores</Link>
              </Button>
            </div>
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Nenhum mentor encontrado</AlertTitle>
            <AlertDescription>
              Não há mentores registrados na plataforma ainda.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentMentorsTab;
