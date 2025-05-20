
import { Link } from 'react-router-dom';
import { User, BookOpen, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertCircle, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Mentorado {
  id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  enrollments_count: number;
}

interface RecentMentoradosTabProps {
  mentorados: Mentorado[];
  isLoading: boolean;
}

const RecentMentoradosTab = ({ mentorados, isLoading }: RecentMentoradosTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <GraduationCap className="mr-2 h-5 w-5" />
          Mentorados Recentes
        </CardTitle>
        <CardDescription>
          Últimos mentorados registrados na plataforma
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
        ) : mentorados.length > 0 ? (
          <div className="space-y-4">
            {mentorados.map((mentorado) => (
              <div key={mentorado.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  {mentorado.avatar_url ? (
                    <img src={mentorado.avatar_url} alt={mentorado.full_name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <User className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{mentorado.full_name || "Mentorado sem nome"}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <BookOpen className="h-3 w-3 mr-1" />
                    <span>{mentorado.enrollments_count} cursos matriculados</span>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="pt-4">
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/mentorados">Ver todos os mentorados</Link>
              </Button>
            </div>
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Nenhum mentorado encontrado</AlertTitle>
            <AlertDescription>
              Não há mentorados registrados na plataforma ainda.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentMentoradosTab;
