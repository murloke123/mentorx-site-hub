
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMentors: 0,
    totalMentorados: 0,
    totalCourses: 0
  });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get mentor count
        const { count: mentorCount, error: mentorError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'mentor');
          
        // Get mentorado count
        const { count: mentoradoCount, error: mentoradoError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'mentorado');
          
        // Get course count
        const { count: courseCount, error: courseError } = await supabase
          .from('courses')
          .select('*', { count: 'exact', head: true });
          
        if (mentorError || mentoradoError || courseError) {
          throw new Error("Error fetching stats");
        }
        
        setStats({
          totalMentors: mentorCount || 0,
          totalMentorados: mentoradoCount || 0,
          totalCourses: courseCount || 0
        });
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  if (loading) {
    return <div className="p-8">Carregando estatísticas...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard de Administração</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Mentores</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalMentors}</p>
            <p className="text-sm text-muted-foreground">Total de mentores na plataforma</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Mentorados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalMentorados}</p>
            <p className="text-sm text-muted-foreground">Total de mentorados na plataforma</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Cursos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalCourses}</p>
            <p className="text-sm text-muted-foreground">Cursos disponíveis na plataforma</p>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Atividades Recentes</h2>
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Nenhuma atividade recente para mostrar.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
