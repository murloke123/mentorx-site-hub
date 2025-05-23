
import { useQuery } from '@tanstack/react-query';
import { getAllMentors } from '@/services/adminService';
import AdminSidebar from '@/components/admin/AdminSidebar';
import MentorsList from '@/components/admin/MentorsList';

interface Mentor {
  id: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  courses_count: number;
  followers_count: number;
}

const AdminMentorsPage = () => {
  const { data: mentorsData = [], isLoading, refetch } = useQuery({
    queryKey: ['allMentors'],
    queryFn: getAllMentors,
  });
  
  // Process the data to ensure types match
  const mentors: Mentor[] = mentorsData.map(mentor => ({
    id: mentor.id,
    full_name: mentor.full_name,
    avatar_url: mentor.avatar_url || '',
    bio: mentor.bio || '',
    followers_count: mentor.followers_count || 0,
    courses_count: typeof mentor.courses_count === 'number' ? 
      mentor.courses_count : 
      (Array.isArray(mentor.courses_count) ? mentor.courses_count.length : 0)
  }));
  
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
