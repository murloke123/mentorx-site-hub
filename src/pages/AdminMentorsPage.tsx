
import { useQuery } from '@tanstack/react-query';
import { getAllMentors } from '@/services/adminService';
import AdminSidebar from '@/components/admin/AdminSidebar';
import MentorsList from '@/components/admin/MentorsList';

const AdminMentorsPage = () => {
  // Buscar mentores
  const { data: mentors = [], isLoading, refetch } = useQuery({
    queryKey: ['allMentors'],
    queryFn: getAllMentors,
  });
  
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Gerenciar Mentores</h1>
          <p className="text-gray-600">Administre todos os mentores da plataforma</p>
        </div>
        
        <MentorsList 
          mentors={mentors} 
          isLoading={isLoading}
          onDelete={() => refetch()}
        />
      </div>
    </div>
  );
};

export default AdminMentorsPage;
