
import { supabase } from "@/integrations/supabase/client";

export async function getEnrolledCourses() {
  try {
    // Obter o ID do usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    const { data, error } = await supabase
      .from("enrollments")
      .select(`
        id,
        course_id,
        progress,
        courses:course_id (id, title, description, mentor_id, profiles:mentor_id (full_name))
      `)
      .eq("user_id", user.id);

    if (error) throw error;
    
    // Formatar os dados para o componente
    const enrolledCourses = data.map(enrollment => {
      const course = enrollment.courses;
      const progress = enrollment.progress?.percent || 0;
      const completedLessons = enrollment.progress?.completed_lessons || 0;
      const totalLessons = enrollment.progress?.total_lessons || 0;
      
      return {
        id: course.id,
        title: course.title,
        description: course.description,
        mentor_id: course.mentor_id,
        mentor_name: course.profiles?.full_name,
        progress,
        completed_lessons: completedLessons,
        total_lessons: totalLessons
      };
    });
    
    return enrolledCourses;
  } catch (error) {
    console.error("Erro ao buscar cursos do mentorado:", error);
    return [];
  }
}

export async function enrollInCourse(courseId: string) {
  try {
    // Obter o ID do usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    // Verificar se o usuário já está inscrito neste curso
    const { data: existingEnrollment, error: checkError } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle();
      
    if (checkError) throw checkError;
    
    // Se já estiver inscrito, não fazer nada
    if (existingEnrollment) {
      return { already_enrolled: true };
    }
    
    // Criar nova inscrição
    const { data, error } = await supabase
      .from("enrollments")
      .insert({
        user_id: user.id,
        course_id: courseId,
        progress: {
          percent: 0,
          completed_lessons: 0,
          total_lessons: 0,
          last_accessed: new Date().toISOString()
        }
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Erro ao se inscrever no curso:", error);
    throw error;
  }
}

export async function updateProgress(courseId: string, lessonId: string, completed: boolean) {
  try {
    // Obter o ID do usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    // Obter a inscrição atual e o progresso
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("enrollments")
      .select("progress")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .single();
      
    if (enrollmentError) throw enrollmentError;
    
    if (!enrollment) {
      throw new Error("Inscrição não encontrada");
    }
    
    // Obter total de conteúdos do curso
    const { count: totalConteudos, error: countError } = await supabase
      .from("conteudos")
      .select("*", { count: 'exact', head: true })
      .eq("modulo_id", "modulos.id")
      .eq("modulos.curso_id", courseId);
      
    if (countError) throw countError;
    
    // Calcular o progresso atualizado
    const progress = enrollment.progress || { 
      completed_lessons: 0,
      completed_lessons_ids: []
    };
    
    let completedLessonsIds = progress.completed_lessons_ids || [];
    
    if (completed && !completedLessonsIds.includes(lessonId)) {
      completedLessonsIds.push(lessonId);
    } else if (!completed && completedLessonsIds.includes(lessonId)) {
      completedLessonsIds = completedLessonsIds.filter(id => id !== lessonId);
    }
    
    const completedLessons = completedLessonsIds.length;
    const percentComplete = totalConteudos ? (completedLessons / totalConteudos) * 100 : 0;
    
    const updatedProgress = {
      ...progress,
      percent: percentComplete,
      completed_lessons: completedLessons,
      total_lessons: totalConteudos,
      completed_lessons_ids: completedLessonsIds,
      last_accessed: new Date().toISOString()
    };
    
    // Atualizar o progresso na inscrição
    const { data, error } = await supabase
      .from("enrollments")
      .update({ progress: updatedProgress })
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Erro ao atualizar progresso:", error);
    throw error;
  }
}

// Adicionando funções necessárias para o MentoradoDashboardPage
export function getMenteeProfile() {
  return getProfile();
}

export function getMenteeCourses() {
  return getEnrolledCourses();
}

async function getProfile() {
  try {
    // Obter o ID do usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return null;
  }
}
