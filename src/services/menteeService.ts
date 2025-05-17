
import { supabase } from '@/integrations/supabase/client';

export const getMenteeProfile = async () => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.session.user.id)
    .single();

  if (error) {
    console.error('Error fetching mentee profile:', error);
    throw error;
  }

  return data;
};

export const getMenteeCourses = async () => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) throw new Error('User not authenticated');

  const { data: enrollments, error: enrollmentsError } = await supabase
    .from('enrollments')
    .select(`
      *,
      course:course_id (
        id, 
        title, 
        description,
        mentor_id,
        mentor:mentor_id (
          full_name
        )
      )
    `)
    .eq('user_id', session.session.user.id);

  if (enrollmentsError) {
    console.error('Error fetching mentee courses:', enrollmentsError);
    throw enrollmentsError;
  }

  // Transform the data to match our component expectations
  const courses = enrollments?.map(enrollment => {
    return {
      id: enrollment.course?.id,
      title: enrollment.course?.title,
      description: enrollment.course?.description,
      mentor_id: enrollment.course?.mentor_id,
      mentor_name: enrollment.course?.mentor?.full_name,
      progress: enrollment.progress?.overall_progress || 0,
      completed_lessons: enrollment.progress?.completed_lessons || 0,
      total_lessons: enrollment.progress?.total_lessons || 0
    };
  }) || [];

  return courses;
};

export const getMenteeCoursesCount = async () => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) return 0;

  const { count, error } = await supabase
    .from('enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', session.session.user.id);

  if (error) {
    console.error('Error fetching mentee courses count:', error);
    return 0;
  }

  return count || 0;
};
