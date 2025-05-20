
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftIcon, BookOpenIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCourseById } from "@/services/courseService";

// Define the Course interface to match what the API returns
interface Course {
  id: string;
  title: string;
  description: string | null;
  mentor_id: string;
  is_paid: boolean;
  price: number | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

const ShowCoursePage = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: course, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourseById(id || ''),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="w-full max-w-4xl mx-auto">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-64 w-full rounded-lg mb-6" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto py-8 text-center">
        <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Curso não encontrado</h2>
        <p className="text-gray-500 mb-6">O curso solicitado não foi encontrado ou não está disponível.</p>
        <Button asChild>
          <Link to="/mentor/cursos">Voltar aos Cursos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-6 flex items-center">
          <Button variant="outline" size="sm" asChild className="mr-4">
            <Link to="/mentor/cursos">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Voltar aos cursos
            </Link>
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{course.title}</CardTitle>
            <CardDescription>
              {course.is_paid ? `Curso pago - R$${course.price?.toFixed(2)}` : "Curso gratuito"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-100 rounded-md mb-6 flex items-center justify-center">
              {course.image_url ? (
                <img 
                  src={course.image_url} 
                  alt={course.title} 
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <BookOpenIcon className="h-12 w-12 text-gray-400" />
              )}
            </div>
            
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-2">Descrição</h3>
              <p className="whitespace-pre-line">{course.description}</p>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-4">
              <Button asChild>
                <Link to={`/mentor/cursos/${id}/editar`}>Editar curso</Link>
              </Button>
              <Button asChild>
                <Link to={`/mentor/cursos/${id}/modulos`}>Gerenciar Módulos</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShowCoursePage;
