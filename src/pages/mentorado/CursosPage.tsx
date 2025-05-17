
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const MentoradoCursosPage = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get the user's enrolled courses
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select(`
            course_id,
            progress,
            enrolled_at,
            courses (
              id,
              title,
              description,
              image_url,
              mentor_id,
              profiles (
                full_name
              )
            )
          `)
          .eq('user_id', user.id);

        if (enrollmentsError) throw enrollmentsError;
        
        if (enrollments) {
          setCourses(enrollments.map(enrollment => ({
            ...enrollment.courses,
            enrolled_at: enrollment.enrolled_at,
            progress: enrollment.progress
          })));
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (loading) {
    return <div className="p-8">Carregando cursos...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Meus Cursos</h1>
      
      {courses.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Você ainda não está inscrito em nenhum curso. 
              Explore a plataforma para encontrar cursos interessantes!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              {course.image_url && (
                <div 
                  className="h-40 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${course.image_url})` }}
                />
              )}
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {course.description?.substring(0, 100)}
                  {course.description?.length > 100 ? '...' : ''}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Mentor: {course.profiles?.full_name || 'Desconhecido'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Progresso: {course.progress?.percentage || 0}%
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentoradoCursosPage;
