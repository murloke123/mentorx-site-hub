
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminMentoresPage = () => {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const fetchMentors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'mentor')
        .order('full_name');
        
      if (error) throw error;
      
      // For each mentor, get follower count and course count
      const mentorsWithStats = await Promise.all(
        (data || []).map(async (mentor) => {
          // Get follower count
          const { count: followerCount, error: followerError } = await supabase
            .from('mentor_followers')
            .select('*', { count: 'exact', head: true })
            .eq('mentor_id', mentor.id);
            
          // Get course count
          const { count: courseCount, error: courseError } = await supabase
            .from('courses')
            .select('*', { count: 'exact', head: true })
            .eq('mentor_id', mentor.id);
            
          if (followerError || courseError) {
            console.error("Error getting mentor stats:", followerError || courseError);
          }
          
          return {
            ...mentor,
            followerCount: followerCount || 0,
            courseCount: courseCount || 0
          };
        })
      );
      
      setMentors(mentorsWithStats);
    } catch (error) {
      console.error("Error fetching mentors:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMentors();
  }, []);
  
  const handleRemoveMentor = async (mentorId: string, mentorName: string) => {
    if (!confirm(`Tem certeza que deseja remover o mentor ${mentorName}? Esta ação não pode ser desfeita.`)) {
      return;
    }
    
    try {
      // First, delete the profile (RLS policies should cascade delete)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', mentorId);
        
      if (error) throw error;
      
      toast({
        title: "Mentor removido",
        description: `O mentor ${mentorName} foi removido com sucesso.`
      });
      
      // Refresh the list
      fetchMentors();
    } catch (error) {
      console.error("Error removing mentor:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao tentar remover o mentor",
        variant: "destructive"
      });
    }
  };
  
  const filteredMentors = mentors.filter(mentor => 
    mentor.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading) {
    return <div className="p-8">Carregando mentores...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Gerenciamento de Mentores</h1>
      
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
                <TableHead>Seguidores</TableHead>
                <TableHead>Cursos</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMentors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Nenhum mentor encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredMentors.map((mentor) => (
                  <TableRow key={mentor.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          {mentor.avatar_url ? (
                            <img 
                              src={mentor.avatar_url} 
                              alt={mentor.full_name} 
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <span>{mentor.full_name?.charAt(0) || "M"}</span>
                          )}
                        </div>
                        {mentor.full_name || "Sem nome"}
                      </div>
                    </TableCell>
                    <TableCell>{mentor.id}</TableCell>
                    <TableCell>{mentor.followerCount}</TableCell>
                    <TableCell>{mentor.courseCount}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Detalhes
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveMentor(mentor.id, mentor.full_name)}
                        >
                          Remover
                        </Button>
                      </div>
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

export default AdminMentoresPage;
