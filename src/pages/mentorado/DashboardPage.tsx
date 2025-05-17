
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const MentoradoDashboardPage = () => {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();
          
          if (profileData) {
            setUserName(profileData.full_name || "");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Olá, {userName}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Cursos Inscritos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Acompanhe seu progresso nos cursos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Mentores Seguidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Mentores que você está seguindo</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Próximas Sessões</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Sessões agendadas com mentores</p>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Atividade Recente</h2>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Nenhuma atividade recente para mostrar.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentoradoDashboardPage;
