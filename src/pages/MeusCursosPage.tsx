
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import MentorSidebar from "@/components/mentor/MentorSidebar";
import CoursesList from "@/components/mentor/CoursesList";
import { getMentorCourses } from '@/services/courseService';

// Interface para representar um curso com matrículas
interface Course {
  id: string;
  title: string;
  description?: string | null;
  is_public: boolean;
  is_paid: boolean;
  price?: number | null;
  image_url?: string | null;
  enrollments?: { count: number }[];
}

const MeusCursosPage = () => {
  const navigate = useNavigate();
  
  // Fetch mentor courses
  const { data = [], isLoading } = useQuery({
    queryKey: ['mentorCourses'],
    queryFn: getMentorCourses,
  });
  
  // Converter os dados para o formato esperado pelo componente
  const courses: Course[] = Array.isArray(data) ? data : [];
  
  // Calculate total enrollments
  const totalEnrollments = courses.reduce((sum, course) => {
    const enrollmentCount = course.enrollments?.[0]?.count;
    return sum + (typeof enrollmentCount === 'number' ? enrollmentCount : 0);
  }, 0);
  
  const handleCreateCourse = () => {
    navigate('/mentor/cursos/novo');
  };

  return (
    <div className="flex">
      <MentorSidebar />
      <div className="flex-1 p-6">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Meus Cursos</h1>
            <p className="text-muted-foreground">Gerencie seus cursos e acompanhe seu desempenho</p>
          </div>
          <Button onClick={handleCreateCourse}>
            <PlusCircle className="mr-2 h-4 w-4" /> Criar Novo Curso
          </Button>
        </div>
        
        <CoursesList 
          courses={courses} 
          isLoading={isLoading} 
          totalEnrollments={totalEnrollments} 
        />
      </div>
    </div>
  );
};

export default MeusCursosPage;
