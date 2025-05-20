
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Clock, BookOpen, Star, ChevronLeft, Play } from "lucide-react";
import { getCourseDetails } from "@/services/courseService";
import { toast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  description: string | null;
  mentor_id: string;
  mentor_name?: string | null;
  is_paid: boolean;
  price: number | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  mentor?: {
    full_name: string;
    avatar_url: string | null;
  };
  is_public?: boolean; // Added to match the courseService response
}

const ShowCoursePage = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await getCourseDetails(id);
        setCourse(data);
      } catch (err) {
        setError("Erro ao carregar detalhes do curso");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleAccessCourse = () => {
    if (id) {
      navigate(`/mentor/curso/${id}`);
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível acessar o curso"
      });
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container max-w-4xl mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">{error || "Curso não encontrado"}</h2>
        <p className="mb-6">Não foi possível carregar os detalhes deste curso.</p>
        <Button asChild>
          <Link to="/courses">Ver todos os cursos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Link to="/courses" className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Voltar para cursos
      </Link>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <div className="flex items-center gap-2 mb-4">
          <Badge variant={course.is_paid ? "default" : "secondary"}>
            {course.is_paid ? `R$${course.price?.toFixed(2)}` : "Gratuito"}
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Sobre o Curso</CardTitle>
            </CardHeader>
            <CardContent>
              {course.image_url && (
                <div className="mb-6">
                  <img 
                    src={course.image_url} 
                    alt={course.title} 
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
              )}
              <p className="text-gray-700">{course.description || "Sem descrição disponível."}</p>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Instrutor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  {course.mentor?.avatar_url ? (
                    <img 
                      src={course.mentor.avatar_url} 
                      alt={course.mentor.full_name} 
                      className="w-12 h-12 rounded-full object-cover" 
                    />
                  ) : (
                    <User className="h-6 w-6 text-gray-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{course.mentor?.full_name || course.mentor_name || "Mentor desconhecido"}</p>
                </div>
              </div>
              
              <Button 
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
                onClick={handleAccessCourse}
              >
                <Play className="h-4 w-4" />
                Ver Curso
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShowCoursePage;
