import { useQuery } from '@tanstack/react-query';
import { getAdminProfile, getPlatformStats, getAllMentors, getAllMentorados, getAllCourses } from '@/services/adminService';
import AdminSidebar from '@/components/admin/AdminSidebar';
import StatsSection from '@/components/admin/StatsSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, BookOpen, GraduationCap, User, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

interface Mentor {
  id: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  courses_count: number;
  followers_count: number;
}

interface Mentorado {
  id: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  enrollments_count: number;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  mentor_id: string;
  mentor_name: string | null;
  is_paid: boolean;
  price: number | null;
  enrollments_count: number;
  created_at: string;
}

const AdminDashboardPage = () => {
  // Fetch admin profile
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: getAdminProfile,
  });
  
  // Fetch platform statistics
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['platformStats'],
    queryFn: getPlatformStats,
  });
  
  // Fetch recent mentors
  const { data: mentors = [], isLoading: isLoadingMentors } = useQuery({
    queryKey: ['recentMentors'],
    queryFn: () => getAllMentors(5),
  });
  
  // Fetch recent mentorados
  const { data: mentorados = [], isLoading: isLoadingMentorados } = useQuery({
    queryKey: ['recentMentorados'],
    queryFn: () => getAllMentorados(5),
  });
  
  // Fetch recent courses
  const { data: courses = [], isLoading: isLoadingCourses } = useQuery({
    queryKey: ['recentCourses'],
    queryFn: () => getAllCourses(5),
  });
  
  // Handle display of mentor_name from courses data
  const getCourseMentorName = (course: any) => {
    if ('mentor_name' in course) {
      return course.mentor_name;
    }
    if (course.profiles?.full_name) {
      return course.profiles.full_name;
    }
    return "Mentor desconhecido";
  };
  
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard de Administração</h1>
          <p className="text-gray-600">Bem-vindo {profile?.full_name || 'Administrador'}</p>
        </div>
        
        {/* Stats Section */}
        <StatsSection 
          isLoading={isLoadingStats} 
          mentorsCount={stats?.mentorsCount || 0}
          mentoreesCount={stats?.mentoreesCount || 0}
          coursesCount={stats?.coursesCount || 0}
          enrollmentsCount={stats?.enrollmentsCount || 0}
        />
        
        {/* Recent Activity Tabs */}
        <Tabs defaultValue="mentors" className="mt-10">
          <TabsList className="mb-4">
            <TabsTrigger value="mentors">Mentores Recentes</TabsTrigger>
            <TabsTrigger value="mentorados">Mentorados Recentes</TabsTrigger>
            <TabsTrigger value="courses">Cursos Recentes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mentors">
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
                {isLoadingMentors ? (
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
          </TabsContent>
          
          <TabsContent value="mentorados">
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
                {isLoadingMentorados ? (
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
          </TabsContent>
          
          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Cursos Recentes
                </CardTitle>
                <CardDescription>
                  Últimos cursos criados na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingCourses ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-16 w-16 rounded" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-40 mb-1" />
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : courses.length > 0 ? (
                  <div className="space-y-4">
                    {(courses as Course[]).map((course) => (
                      <div key={course.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
                        <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{course.title}</p>
                          <p className="text-sm text-gray-500">Por {getCourseMentorName(course)}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={course.is_paid ? "default" : "secondary"}>
                              {course.is_paid ? `R$${course.price?.toFixed(2)}` : "Gratuito"}
                            </Badge>
                            <Badge variant="outline" className="text-gray-500">
                              {course.enrollments_count} matrículas
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4">
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/admin/cursos">Ver todos os cursos</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Nenhum curso encontrado</AlertTitle>
                    <AlertDescription>
                      Não há cursos criados na plataforma ainda.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
