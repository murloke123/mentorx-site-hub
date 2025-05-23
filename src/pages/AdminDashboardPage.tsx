
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
  const { data: mentorsData = [], isLoading: isLoadingMentors } = useQuery({
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
          mentors={mentorsData.map(mentor => ({ 
            ...mentor, 
            followers_count: mentor.followers_count || 0,
            // Fix: Ensure courses_count is always a number
            courses_count: typeof mentor.courses_count === 'number' ? 
              mentor.courses_count : 
              (Array.isArray(mentor.courses_count) ? mentor.courses_count.length : 0)
          }))}
          mentorados={mentorados.map(mentorado => ({
            ...mentorado,
            // Fix: Ensure enrollments_count is always a number
            enrollments_count: typeof mentorado.enrollments_count === 'number' ? 
              mentorado.enrollments_count : 
              (Array.isArray(mentorado.enrollments_count) ? mentorado.enrollments_count.length : 0)
          }))}
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
