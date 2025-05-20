
import { useQuery } from '@tanstack/react-query';
import { getAllCourses } from '@/services/adminService';
import AdminSidebar from '@/components/admin/AdminSidebar';
import CoursesList from '@/components/admin/CoursesList';

interface Course {
  id: string;
  title: string;
  description: string | null;
  mentor_id: string;
  mentor_name: string | null;
  is_paid: boolean;
  price: number | null;
  enrollments_count: number;
  created_at: string;
}

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
          courses={courses as Course[]} 
          isLoading={isLoading}
          onDelete={() => refetch()}
        />
      </div>
    </div>
  );
};

export default AdminCoursesPage;
