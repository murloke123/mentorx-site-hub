
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const AdminCursosPage = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select(`
            *,
            profiles:mentor_id (
              full_name
            ),
            enrollments (
              count
            )
          `)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setCourses(data || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);
  
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading) {
    return <div className="p-8">Carregando cursos...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Gerenciamento de Cursos</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Estatísticas de Cursos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-3xl font-bold">{courses.length}</p>
              <p className="text-sm text-muted-foreground">Total de cursos</p>
            </div>
            <div>
              <p className="text-3xl font-bold">
                {courses.filter(c => c.is_public).length}
              </p>
              <p className="text-sm text-muted-foreground">Cursos públicos</p>
            </div>
            <div>
              <p className="text-3xl font-bold">
                {courses.filter(c => c.is_paid).length}
              </p>
              <p className="text-sm text-muted-foreground">Cursos pagos</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-between mb-6">
        <Input
          placeholder="Buscar por título ou mentor..."
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
                <TableHead>Título</TableHead>
                <TableHead>Mentor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Inscritos</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Nenhum curso encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>{course.profiles?.full_name || "Desconhecido"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${course.is_public ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {course.is_public ? "Público" : "Privado"}
                      </span>
                      {" "}
                      <span className={`px-2 py-1 rounded-full text-xs ${course.is_paid ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                        {course.is_paid ? "Pago" : "Gratuito"}
                      </span>
                    </TableCell>
                    <TableCell>{course.enrollments?.length || 0}</TableCell>
                    <TableCell>{new Date(course.created_at).toLocaleDateString()}</TableCell>
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

export default AdminCursosPage;
