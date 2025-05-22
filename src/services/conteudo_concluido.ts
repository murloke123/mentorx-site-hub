
import { supabase } from "@/integrations/supabase/client";

interface CompletedContent {
  id?: string;
  user_id: string;
  course_id: string;
  module_id: string;
  content_id: string;
}

interface Progress {
  percent: number;
  completed_lessons: number;
  total_lessons: number;
}

export async function markContentCompleted(courseId: string, moduleId: string, contentId: string) {
  try {
    // Obter o ID do usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    // Verificar se já está marcado como concluído
    const { data: existente, error: checkError } = await supabase
      .from("conteudo_concluido")
      .select("id")
      .eq("user_id", user.id)
      .eq("conteudo_id", contentId)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existente) {
      // Se já está marcado como concluído, apenas retorna
      return existente;
    }
    
    // Inserir novo registro de conteúdo concluído
    const { data, error } = await supabase
      .from("conteudo_concluido")
      .insert({
        user_id: user.id,
        curso_id: courseId,
        modulo_id: moduleId,
        conteudo_id: contentId
      })
      .select()
      .single();

    if (error) throw error;

    // Atualizar o progresso do curso
    await updateCourseProgress(courseId);
    
    return data;
  } catch (error) {
    console.error("Erro ao marcar conteúdo como concluído:", error);
    throw error;
  }
}

export async function unmarkContentCompleted(contentId: string) {
  try {
    // Obter o ID do usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Buscar o registro para obter o curso_id antes de excluir
    const { data: registro, error: fetchError } = await supabase
      .from("conteudo_concluido")
      .select("curso_id")
      .eq("user_id", user.id)
      .eq("conteudo_id", contentId)
      .maybeSingle();
      
    if (fetchError) throw fetchError;
    
    if (!registro) {
      // Se não encontrado, retorna
      return null;
    }

    const courseId = registro.curso_id;
    
    // Excluir o registro
    const { error } = await supabase
      .from("conteudo_concluido")
      .delete()
      .eq("user_id", user.id)
      .eq("conteudo_id", contentId);

    if (error) throw error;

    // Atualizar o progresso do curso
    await updateCourseProgress(courseId);
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao desmarcar conteúdo como concluído:", error);
    throw error;
  }
}

export async function checkContentCompleted(contentId: string) {
  try {
    // Obter o ID do usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    const { data, error } = await supabase
      .from("conteudo_concluido")
      .select("id")
      .eq("user_id", user.id)
      .eq("conteudo_id", contentId)
      .maybeSingle();

    if (error) throw error;
    
    return !!data; // Retorna true se o conteúdo estiver concluído
  } catch (error) {
    console.error("Erro ao verificar se conteúdo está concluído:", error);
    return false;
  }
}

async function updateCourseProgress(courseId: string) {
  try {
    // Obter o ID do usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    // Contar total de conteúdos no curso
    const { count: totalContents, error: totalError } = await supabase
      .from("conteudos")
      .select("id", { count: 'exact', head: true })
      .eq("modulo_id", "modulos.id")
      .eq("modulos.curso_id", courseId);
      
    if (totalError) throw totalError;
    
    if (!totalContents || totalContents === 0) return;
    
    // Contar conteúdos concluídos pelo usuário
    const { count: completed, error: completedError } = await supabase
      .from("conteudo_concluido")
      .select("id", { count: 'exact', head: true })
      .eq("user_id", user.id)
      .eq("curso_id", courseId);
      
    if (completedError) throw completedError;
    
    const percent = (completed || 0) / totalContents * 100;
    
    // Criar objeto de progresso
    const progressData = {
      percent: percent,
      completed_lessons: completed || 0,
      total_lessons: totalContents
    };
    
    // Atualizar a matrícula com o progresso
    const { error: updateError } = await supabase
      .from("enrollments")
      .update({ progress: progressData })
      .eq("user_id", user.id)
      .eq("course_id", courseId);
      
    if (updateError) throw updateError;
  } catch (error) {
    console.error("Erro ao atualizar progresso do curso:", error);
    throw error;
  }
}
