
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const AdminMentoradosPage = () => {
  const [mentorados, setMentorados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const fetchMentorados = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'mentorado')
          .order('full_name');
          
        if (error) throw error;
        
        // For each mentorado, get enrollment count and following count
        const mentoradosWithStats = await Promise.all(
          (data || []).map(async (mentorado) => {
            // Get enrollment count
            const { count: enrollmentCount, error: enrollmentError } = await supabase
              .from('enrollments')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', mentorado.id);
              
            // Get following count
            const { count: followingCount, error: followingError } = await supabase
              .from('mentor_followers')
              .select('*', { count: 'exact', head: true })
              .eq('follower_id', mentorado.id);
              
            if (enrollmentError || followingError) {
              console.error("Error getting mentorado stats:", enrollmentError || followingError);
            }
            
            return {
              ...mentorado,
              enrollmentCount: enrollmentCount || 0,
              followingCount: followingCount || 0
            };
          })
        );
        
        setMentorados(mentoradosWithStats);
      } catch (error) {
        console.error("Error fetching mentorados:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMentorados();
  }, []);
  
  const filteredMentorados = mentorados.filter(mentorado => 
    mentorado.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading) {
    return <div className="p-8">Carregando mentorados...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Gerenciamento de Mentorados</h1>
      
      <div className="flex items-center justify-between mb-6">
        <Input
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Cursos Inscritos</TableHead>
                <TableHead>Seguindo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMentorados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Nenhum mentorado encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredMentorados.map((mentorado) => (
                  <TableRow key={mentorado.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          {mentorado.avatar_url ? (
                            <img 
                              src={mentorado.avatar_url} 
                              alt={mentorado.full_name} 
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <span>{mentorado.full_name?.charAt(0) || "M"}</span>
                          )}
                        </div>
                        {mentorado.full_name || "Sem nome"}
                      </div>
                    </TableCell>
                    <TableCell>{mentorado.id}</TableCell>
                    <TableCell>{mentorado.enrollmentCount}</TableCell>
                    <TableCell>{mentorado.followingCount}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMentoradosPage;
