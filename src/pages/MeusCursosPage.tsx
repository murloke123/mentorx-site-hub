
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import UserSidebar from "@/components/UserSidebar";
import CoursesList from "@/components/mentor/CoursesList";
import { getMentorCourses } from '@/services/courseService';

const MeusCursosPage = () => {
  const navigate = useNavigate();
  
  // Fetch mentor courses
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['mentorCourses'],
    queryFn: getMentorCourses,
  });
  
  // Calculate total enrollments
  const totalEnrollments = courses.reduce((sum, course) => {
    return sum + (course.enrollments?.[0]?.count || 0);
  }, 0);
  
  const handleCreateCourse = () => {
    navigate('/mentor/cursos/novo');
  };

  return (
    <div className="flex">
      <UserSidebar />
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
