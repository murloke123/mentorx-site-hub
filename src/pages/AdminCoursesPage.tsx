
import { useQuery } from '@tanstack/react-query';
import { getAllCourses } from '@/services/adminService';
import AdminSidebar from '@/components/admin/AdminSidebar';
import CoursesList from '@/components/admin/CoursesList';

const AdminCoursesPage = () => {
  // Buscar cursos
  const { data: courses = [], isLoading, refetch } = useQuery({
    queryKey: ['allCourses'],
    queryFn: getAllCourses,
  });
  
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Gerenciar Cursos</h1>
          <p className="text-gray-600">Administre todos os cursos da plataforma</p>
        </div>
        
        <CoursesList 
          courses={courses} 
          isLoading={isLoading}
          onDelete={() => refetch()}
        />
      </div>
    </div>
  );
};

export default AdminCoursesPage;
