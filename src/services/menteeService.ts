
import { supabase } from "@/integrations/supabase/client";

type Progress = {
  percent: number;
  completed_lessons: number;
  total_lessons: number;
  completed_lessons_ids?: string[];
  last_accessed?: string;
};

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
        cursos:course_id (id, titulo, descricao, mentor_id, profiles:mentor_id (full_name))
      `)
      .eq("user_id", user.id);

    if (error) throw error;
    
    // Formatar os dados para o componente
    const enrolledCourses = data.map(enrollment => {
      const course = enrollment.cursos;
      // Safely cast progress to our expected type or use default values
      const progressData = enrollment.progress as Progress | null || { 
        percent: 0, 
        completed_lessons: 0, 
        total_lessons: 0 
      };
      
      return {
        id: course.id,
        title: course.titulo,
        description: course.descricao,
        mentor_id: course.mentor_id,
        mentor_name: course.profiles?.full_name,
        progress: progressData.percent || 0,
        completed_lessons: progressData.completed_lessons || 0,
        total_lessons: progressData.total_lessons || 0
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
    
    // Criar nova inscrição com progresso inicial
    const initialProgress: Progress = {
      percent: 0,
      completed_lessons: 0,
      total_lessons: 0,
      completed_lessons_ids: [],
      last_accessed: new Date().toISOString()
    };
    
    // Criar nova inscrição
    const { data, error } = await supabase
      .from("enrollments")
      .insert({
        user_id: user.id,
        course_id: courseId,
        progress: initialProgress
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
      .eq("module_id", "modulos.id")
      .eq("modulos.curso_id", courseId);
      
    if (countError) throw countError;
    
    // Calcular o progresso atualizado
    const progress = enrollment.progress as Progress || { 
      completed_lessons: 0,
      completed_lessons_ids: [],
      percent: 0,
      total_lessons: 0
    };
    
    // Garantir que temos um array com os ids
    const completedLessonsIds = Array.isArray(progress.completed_lessons_ids) 
      ? [...progress.completed_lessons_ids] 
      : [];
    
    if (completed && !completedLessonsIds.includes(lessonId)) {
      completedLessonsIds.push(lessonId);
    } else if (!completed) {
      const index = completedLessonsIds.indexOf(lessonId);
      if (index !== -1) {
        completedLessonsIds.splice(index, 1);
      }
    }
    
    const completedLessons = completedLessonsIds.length;
    const percentComplete = totalConteudos ? (completedLessons / totalConteudos) * 100 : 0;
    
    const updatedProgress: Progress = {
      percent: percentComplete,
      completed_lessons: completedLessons,
      total_lessons: totalConteudos || 0,
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
