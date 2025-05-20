import { useQuery } from '@tanstack/react-query';
import { getMenteeProfile, getMenteeCourses } from '@/services/menteeService';
import StatsSection from '@/components/mentee/StatsSection';
import EnrolledCoursesList from '@/components/mentee/EnrolledCoursesList';
import MentoradoSidebar from '@/components/mentee/MentoradoSidebar';

interface Course {
  id: string;
  title: string;
  description?: string;
  mentor_id: string;
  mentor_name?: string;
  progress: number;
  completed_lessons: number;
  total_lessons: number;
}

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
  
  // Convert courses to the expected type
  const coursesArray: Course[] = Array.isArray(courses) ? courses : [];
  
  // Calculate total progress
  const totalProgress = coursesArray.length > 0
    ? coursesArray.reduce((sum, course) => sum + (course.progress || 0), 0) / coursesArray.length
    : 0;
  
  // Calculate completed lessons
  const completedLessons = coursesArray.reduce((sum, course) => sum + (course.completed_lessons || 0), 0);
  
  // Calculate active mentors
  const activeMentors = coursesArray.reduce((acc, curr) => {
    if (!acc.includes(curr.mentor_id)) {
      acc.push(curr.mentor_id);
    }
    return acc;
  }, []).length;
  
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
          enrolledCourses={coursesArray.length}
          completedLessons={completedLessons}
          activeMentors={activeMentors}
        />

        {/* Enrolled Courses Section */}
        <EnrolledCoursesList 
          courses={coursesArray} 
          isLoading={isLoadingCourses} 
        />
      </div>
    </div>
  );
};

export default MentoradoDashboardPage;
