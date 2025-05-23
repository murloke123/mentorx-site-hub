
import { useQuery } from '@tanstack/react-query';
import { getAllMentorados } from '@/services/adminService';
import AdminSidebar from '@/components/admin/AdminSidebar';
import MentoradosList from '@/components/admin/MentoradosList';

interface Mentorado {
  id: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  enrollments_count: number;
}

const AdminMentoradosPage = () => {
  const { data: mentoradosData = [], isLoading, refetch } = useQuery({
    queryKey: ['allMentorados'],
    queryFn: getAllMentorados,
  });
  
  // Process the data to ensure types match
  const mentorados: Mentorado[] = mentoradosData.map(mentorado => ({
    id: mentorado.id,
    full_name: mentorado.full_name,
    avatar_url: mentorado.avatar_url || '',
    bio: mentorado.bio || '',
    enrollments_count: typeof mentorado.enrollments_count === 'number' ? 
      mentorado.enrollments_count : 
      (Array.isArray(mentorado.enrollments_count) ? mentorado.enrollments_count.length : 0)
  }));
  
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Gerenciar Mentorados</h1>
          <p className="text-gray-600">Administre todos os mentorados da plataforma</p>
        </div>
        
        <MentoradosList 
          mentorados={mentorados} 
          isLoading={isLoading}
          onDelete={() => refetch()}
        />
      </div>
    </div>
  );
};

export default AdminMentoradosPage;
