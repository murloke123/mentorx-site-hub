
import { supabase } from "@/integrations/supabase/client";

export async function getAllCourses() {
  try {
    const { data, error } = await supabase
      .from("cursos") // Atualizado para usar a tabela renomeada
      .select(`
        id, 
        title, 
        description, 
        mentor_id, 
        is_paid, 
        price, 
        created_at,
        profiles:mentor_id (full_name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calcular contagem de matrículas para cada curso
    const coursesWithEnrollments = await Promise.all(
      data.map(async (course) => {
        const { count, error: countError } = await supabase
          .from('enrollments')
          .select('*', { count: 'exact', head: true })
          .eq('course_id', course.id);

        if (countError) {
          console.error("Erro ao contar matrículas:", countError);
          return { ...course, enrollments_count: 0 };
        }

        return {
          ...course,
          mentor_name: course.profiles?.full_name,
          enrollments_count: count || 0
        };
      })
    );

    return coursesWithEnrollments;
  } catch (error) {
    console.error("Erro ao buscar todos os cursos:", error);
    throw error;
  }
}

export async function deleteCourse(courseId: string) {
  try {
    const { error } = await supabase
      .from("cursos") // Atualizado para usar a tabela renomeada
      .delete()
      .eq("id", courseId);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Erro ao deletar curso:", error);
    throw error;
  }
}
