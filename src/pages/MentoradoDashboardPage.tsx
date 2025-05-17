
import { useQuery } from '@tanstack/react-query';
import { getMenteeProfile, getMenteeCourses } from '@/services/menteeService';
import StatsSection from '@/components/mentee/StatsSection';
import EnrolledCoursesList from '@/components/mentee/EnrolledCoursesList';
import MentoradoSidebar from '@/components/mentee/MentoradoSidebar';

const MentoradoDashboardPage = () => {
  // Fetch the mentee profile
  const { data: profile } = useQuery({
    queryKey: ['menteeProfile'],
    queryFn: getMenteeProfile,
  });
  
  // Fetch mentee enrolled courses
  const { data: courses = [], isLoading: isLoadingCourses } = useQuery({
    queryKey: ['menteeCourses'],
    queryFn: getMenteeCourses,
  });
  
  return (
    <div className="flex">
      <MentoradoSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {profile ? `Bem-vindo, ${profile.full_name || 'Mentorado'}!` : 'Dashboard'}
          </h1>
          <p className="text-gray-600">Acompanhe seus cursos e seu progresso</p>
        </div>

        {/* Stats Section */}
        <StatsSection 
          enrolledCourses={courses.length}
          completedLessons={courses.reduce((sum, course) => sum + (course.completed_lessons || 0), 0)}
          activeMentors={courses.reduce((acc, curr) => {
            if (!acc.includes(curr.mentor_id)) {
              acc.push(curr.mentor_id);
            }
            return acc;
          }, []).length}
        />

        {/* Enrolled Courses Section */}
        <EnrolledCoursesList 
          courses={courses} 
          isLoading={isLoadingCourses} 
        />
      </div>
    </div>
  );
};

export default MentoradoDashboardPage;
