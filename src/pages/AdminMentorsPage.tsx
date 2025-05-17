
import { useQuery } from '@tanstack/react-query';
import { getAllMentors } from '@/services/adminService';
import AdminSidebar from '@/components/admin/AdminSidebar';
import MentorsList from '@/components/admin/MentorsList';
import { useToast } from '@/hooks/use-toast';

const AdminMentorsPage = () => {
  const { toast } = useToast();
  
  // Buscar mentores com log adicional para depuração
  const { data: mentors = [], isLoading, refetch } = useQuery({
    queryKey: ['allMentors'],
    queryFn: async () => {
      console.log('Buscando mentores...');
      try {
        const result = await getAllMentors();
        console.log('Mentores encontrados:', result);
        return result;
      } catch (error) {
        console.error('Erro ao buscar mentores:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar mentores",
          description: "Não foi possível carregar a lista de mentores."
        });
        return [];
      }
    },
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
