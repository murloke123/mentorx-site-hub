
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Function to fetch enrollments for mentor courses
async function getMentorEnrollments() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Not authenticated");
  
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      profiles:user_id(*),
      courses!inner(*)
    `)
    .eq('courses.mentor_id', user.id)
    .order('enrolled_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export default function MentorEnrollmentsPage() {
  // Fetch enrollments
  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ['mentorEnrollments'],
    queryFn: getMentorEnrollments,
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Course Enrollments</h1>
        <p className="text-gray-600">Students enrolled in your courses</p>
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">
          <p>Loading enrollments...</p>
        </div>
      ) : enrollments.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No enrollments yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p>When students enroll in your courses, they'll appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {enrollments.map((enrollment) => (
            <Card key={enrollment.id}>
              <CardHeader>
                <CardTitle>{enrollment.profiles?.full_name || 'Anonymous User'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{enrollment.courses?.title}</p>
                <p className="text-sm text-muted-foreground">
                  Enrolled on {new Date(enrollment.enrolled_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
