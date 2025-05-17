import { useQuery } from '@tanstack/react-query';
import { getAdminProfile, getPlatformStats, getAllMentors, getAllCourses } from '@/services/adminService';
import AdminSidebar from '@/components/admin/AdminSidebar';
import StatsSection from '@/components/admin/StatsSection';
import MentorsList from '@/components/admin/MentorsList';
import CoursesList from '@/components/admin/CoursesList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge"; // Added Badge import
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboardPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Verificar se o usuário é um administrador
  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session?.user) {
        toast({
          variant: "destructive",
          title: "Acesso negado",
          description: "Você precisa estar logado para acessar esta página."
        });
        navigate('/login');
        return;
      }
      
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.session.user.id)
        .single();
      
      if (data?.role !== 'admin') {
        toast({
          variant: "destructive",
          title: "Acesso negado",
          description: "Apenas administradores podem acessar esta página."
        });
        navigate('/');
      }
    };
    
    checkAdminStatus();
  }, [navigate, toast]);
  
  // Buscar o perfil do admin
  const { data: profile } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: getAdminProfile,
  });
  
  // Buscar estatísticas da plataforma
  const { data: stats = { 
    mentorsCount: 0, 
    mentoreesCount: 0, 
    coursesCount: 0, 
    enrollmentsCount: 0 
  }, isLoading: isLoadingStats } = useQuery({
    queryKey: ['platformStats'],
    queryFn: getPlatformStats,
  });
  
  // Buscar lista de mentores populares
  const { data: mentors = [], isLoading: isLoadingMentors } = useQuery({
    queryKey: ['allMentors'],
    queryFn: getAllMentors,
  });
  
  // Buscar lista de cursos populares
  const { data: courses = [], isLoading: isLoadingCourses } = useQuery({
    queryKey: ['allCourses'],
    queryFn: getAllCourses,
  });
  
  // Top mentores com mais cursos
  const topMentorsByCourses = [...mentors]
    .sort((a, b) => b.courses_count - a.courses_count)
    .slice(0, 5);
  
  // Top mentores com mais seguidores
  const topMentorsByFollowers = [...mentors]
    .sort((a, b) => b.followers_count - a.followers_count)
    .slice(0, 5);
  
  // Cursos com mais matrículas
  const coursesWithMostEnrollments = [...courses]
    .sort((a, b) => b.enrollments_count - a.enrollments_count)
    .slice(0, 5);
  
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {profile ? `Dashboard Admin - ${profile.full_name || 'Administrador'}` : 'Dashboard Admin'}
          </h1>
          <p className="text-gray-600">Gerencie a plataforma e acompanhe estatísticas</p>
        </div>

        {/* Stats Section */}
        {isLoadingStats ? (
          <div className="mb-8 grid gap-6 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : (
          <StatsSection
            mentorsCount={stats.mentorsCount}
            mentoreesCount={stats.mentoreesCount}
            coursesCount={stats.coursesCount}
            enrollmentsCount={stats.enrollmentsCount}
          />
        )}

        {/* Tabs for different views */}
        <Tabs defaultValue="mentors" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="mentors">Top Mentores</TabsTrigger>
            <TabsTrigger value="courses">Cursos Populares</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mentors" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Mentores com mais cursos */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Mentores por Cursos</CardTitle>
                  <CardDescription>Mentores que têm mais cursos na plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingMentors ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-8 w-full" />
                      ))}
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {topMentorsByCourses.map((mentor) => (
                        <li key={mentor.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{mentor.full_name || 'Sem nome'}</span>
                          </div>
                          <Badge variant="outline">{mentor.courses_count} cursos</Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
              
              {/* Mentores com mais seguidores */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Mentores por Seguidores</CardTitle>
                  <CardDescription>Mentores que têm mais seguidores na plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingMentors ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-8 w-full" />
                      ))}
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {topMentorsByFollowers.map((mentor) => (
                        <li key={mentor.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{mentor.full_name || 'Sem nome'}</span>
                          </div>
                          <Badge variant="outline">{mentor.followers_count} seguidores</Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Lista completa de mentores */}
            <h2 className="text-xl font-bold mt-8 mb-4">Todos os Mentores</h2>
            <MentorsList 
              mentors={mentors} 
              isLoading={isLoadingMentors} 
            />
          </TabsContent>
          
          <TabsContent value="courses">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Top Cursos por Matrículas</CardTitle>
                <CardDescription>Cursos com mais alunos matriculados</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingCourses ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {coursesWithMostEnrollments.map((course) => (
                      <li key={course.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{course.title}</span>
                          <p className="text-xs text-gray-500">por {course.mentor_name || 'Mentor desconhecido'}</p>
                        </div>
                        <Badge variant="outline">{course.enrollments_count} matrículas</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
            
            {/* Lista completa de cursos */}
            <h2 className="text-xl font-bold mt-8 mb-4">Todos os Cursos</h2>
            <CoursesList 
              courses={courses} 
              isLoading={isLoadingCourses} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
