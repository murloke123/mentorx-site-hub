import { useQuery } from '@tanstack/react-query';
import { getMentorProfile, getMentorCourses, getMentorFollowersCount } from '@/services/mentorService';
import StatsSection from '@/components/mentor/StatsSection';
import AnalyticsSection from '@/components/mentor/AnalyticsSection';
// import CoursesList from '@/components/mentor/CoursesList'; // Removido
import MentorSidebar from '@/components/mentor/MentorSidebar';

const MentorDashboardPage = () => {
  // Fetch the mentor profile
  const { data: profile } = useQuery({
    queryKey: ['mentorProfile'],
    queryFn: getMentorProfile,
  });
  
  // Fetch mentor courses (ainda necessário para StatsSection, a menos que StatsSection seja alterada)
  const { data: courses = [] } = useQuery({
    queryKey: ['mentorCourses'],
    queryFn: getMentorCourses,
  });
  
  // Fetch follower count
  const { data: followersCount = 0 } = useQuery({
    queryKey: ['mentorFollowers'],
    queryFn: getMentorFollowersCount,
  });
  
  // Stats calculations
  const totalCourses = courses.length;
  const totalEnrollments = courses.reduce((sum, course) => {
    return sum + (course.enrollments?.[0]?.count || 0);
  }, 0);
  
  // Calculate estimated revenue (for paid courses)
  const totalRevenue = courses.reduce((sum, course) => {
    if (course.is_paid && course.price) {
      return sum + (course.price * (course.enrollments?.[0]?.count || 0));
    }
    return sum;
  }, 0);
  
  return (
    <div className="flex">
      <MentorSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {profile ? `Bem-vindo(a), ${profile.full_name || 'Mentor(a)'}!` : 'Painel do Mentor'}
          </h1>
          <p className="text-gray-600">Gerencie suas métricas e acompanhe seu desempenho.</p>
        </div>

        {/* Stats Section */}
        <StatsSection 
          followersCount={followersCount} 
          totalCourses={totalCourses}
          totalEnrollments={totalEnrollments}
          totalRevenue={totalRevenue}
        />

        {/* Analytics Section - RecentModules estava aqui dentro ou ao lado */}
        <AnalyticsSection />

        {/* Courses Section Removida */}
        {/* 
          <CoursesList 
            courses={courses} 
            isLoading={isLoadingCourses} 
            totalEnrollments={totalEnrollments} 
          />
        */}
      </div>
    </div>
  );
};

export default MentorDashboardPage;
