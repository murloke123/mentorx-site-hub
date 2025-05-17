
import { useQuery } from '@tanstack/react-query';
import { getAllMentorees } from '@/services/adminService';
import AdminSidebar from '@/components/admin/AdminSidebar';
import MentoradosList from '@/components/admin/MentoradosList';

const AdminMentoradosPage = () => {
  // Buscar mentorados
  const { data: mentorados = [], isLoading, refetch } = useQuery({
    queryKey: ['allMentorees'],
    queryFn: getAllMentorees,
  });
  
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
