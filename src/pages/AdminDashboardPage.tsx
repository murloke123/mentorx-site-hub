
import { useQuery } from '@tanstack/react-query';
import { getAdminProfile, getPlatformStats, getAllMentors, getAllMentorados, getAllCourses } from '@/services/adminService';
import AdminSidebar from '@/components/admin/AdminSidebar';
import StatsSection from '@/components/admin/StatsSection';
import AdminHeader from '@/components/admin/dashboard/AdminHeader';
import DashboardTabs from '@/components/admin/dashboard/DashboardTabs';

interface AdminProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  role: string;
  updated_at: string;
}

interface PlatformStats {
  mentorsCount: number;
  mentoreesCount: number;
  coursesCount: number;
  enrollmentsCount: number;
}

const AdminDashboardPage = () => {
  // Fetch admin profile
  const { data: profile, isLoading: isLoadingProfile } = useQuery<AdminProfile | null>({
    queryKey: ['adminProfile'],
    queryFn: getAdminProfile,
  });
  
  // Fetch platform statistics
  const { data: stats, isLoading: isLoadingStats } = useQuery<PlatformStats>({
    queryKey: ['platformStats'],
    queryFn: getPlatformStats,
  });
  
  // Fetch recent mentors
  const { data: mentors = [], isLoading: isLoadingMentors } = useQuery({
    queryKey: ['recentMentors'],
    queryFn: () => getAllMentors({ queryKey: ['recentMentors'], signal: undefined }),
  });
  
  // Fetch recent mentorados
  const { data: mentorados = [], isLoading: isLoadingMentorados } = useQuery({
    queryKey: ['recentMentorados'],
    queryFn: () => getAllMentorados({ queryKey: ['recentMentorados'], signal: undefined }),
  });
  
  // Fetch recent courses
  const { data: courses = [], isLoading: isLoadingCourses } = useQuery({
    queryKey: ['recentCourses'],
    queryFn: () => getAllCourses({ queryKey: ['recentCourses'], signal: undefined }),
  });
  
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <AdminHeader fullName={profile?.full_name} />
        
        <StatsSection 
          mentorsCount={stats?.mentorsCount || 0}
          mentoreesCount={stats?.mentoreesCount || 0}
          coursesCount={stats?.coursesCount || 0}
          enrollmentsCount={stats?.enrollmentsCount || 0}
        />
        
        <DashboardTabs 
          mentors={mentors}
          mentorados={mentorados}
          courses={courses}
          isLoadingMentors={isLoadingMentors}
          isLoadingMentorados={isLoadingMentorados}
          isLoadingCourses={isLoadingCourses}
        />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
