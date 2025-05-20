
import { supabase } from "@/integrations/supabase/client";

// Interface for Conteudo
interface Conteudo {
  id: string;
  modulo_id: string;
  nome_conteudo: string;
  tipo_conteudo: string;
  descricao_conteudo?: string;
  ordem: number;
  dados_conteudo?: {
    video_url?: string;
    texto_rico?: string;
    pdf_url?: string;
    pdf_filename?: string;
  };
  created_at: string;
  updated_at: string;
}

// Interface for Modulo
interface Modulo {
  id: string;
  curso_id: string;
  nome_modulo: string;
  descricao_modulo?: string;
  ordem: number;
  created_at: string;
  updated_at: string;
  conteudos: Conteudo[];
}

// Interface for Curso with modulos
interface Curso {
  id: string;
  title: string;
  description?: string;
  mentor_id: string;
  image_url?: string;
  modulos: Modulo[];
}

// Interface for ConteudoConcluido
interface ConteudoConcluido {
  id: string;
  user_id: string;
  curso_id: string;
  modulo_id: string;
  conteudo_id: string;
  created_at: string;
}

// Get course details for player
export async function getCourseDetailsForPlayer(cursoId: string) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    // Get curso
    const { data: curso, error: cursoError } = await supabase
      .from("courses")
      .select("id, title, description, mentor_id, image_url")
      .eq("id", cursoId)
      .single();

    if (cursoError) throw cursoError;
    if (!curso) throw new Error("Curso não encontrado");

    // Get modulos
    const { data: modulos, error: modulosError } = await supabase
      .from("modulos")
      .select("*")
      .eq("curso_id", cursoId)
      .order("ordem", { ascending: true });

    if (modulosError) throw modulosError;

    // Get conteudos for each modulo
    const modulosWithContent = await Promise.all(modulos.map(async (modulo) => {
      const { data: conteudos, error: conteudosError } = await supabase
        .from("conteudos")
        .select("*")
        .eq("modulo_id", modulo.id)
        .order("ordem", { ascending: true });

      if (conteudosError) throw conteudosError;

      return {
        ...modulo,
        conteudos: conteudos || []
      };
    }));

    // Get completed conteudos
    const { data: completedContent, error: completedError } = await supabase
      .from("conteudo_concluido")
      .select("conteudo_id")
      .eq("user_id", user.id)
      .eq("curso_id", cursoId);

    if (completedError) throw completedError;

    // Prepare complete course data
    const cursoWithModulos: Curso = {
      ...curso,
      modulos: modulosWithContent
    };

    // Extract completed content IDs
    const completedContentIds = completedContent?.map(item => item.conteudo_id) || [];

    return {
      curso: cursoWithModulos,
      completedContentIds
    };
  } catch (error) {
    console.error("Erro ao buscar detalhes do curso:", error);
    throw error;
  }
}

// Mark conteudo as concluido
export async function markConteudoAsConcluido(cursoId: string, moduloId: string, conteudoId: string) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    // Check if already completed
    const { data: existing, error: checkError } = await supabase
      .from("conteudo_concluido")
      .select("*")
      .eq("user_id", user.id)
      .eq("conteudo_id", conteudoId)
      .maybeSingle();

    if (checkError) throw checkError;
    
    // If already marked as completed, return it
    if (existing) return existing;

    // Insert new completion record
    const { data, error } = await supabase
      .from("conteudo_concluido")
      .insert({
        user_id: user.id,
        curso_id: cursoId,
        modulo_id: moduloId,
        conteudo_id: conteudoId
      })
      .select()
      .single();

    if (error) throw error;

    // Update course progress
    await updateCourseProgress(cursoId, user.id);

    return data;
  } catch (error) {
    console.error("Erro ao marcar conteúdo como concluído:", error);
    throw error;
  }
}

// Mark conteudo as incompleto (remove from completed)
export async function markConteudoAsIncompleto(cursoId: string, moduloId: string, conteudoId: string) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    // Delete the completion record
    const { error } = await supabase
      .from("conteudo_concluido")
      .delete()
      .eq("user_id", user.id)
      .eq("conteudo_id", conteudoId);

    if (error) throw error;

    // Update course progress
    await updateCourseProgress(cursoId, user.id);

    return { success: true };
  } catch (error) {
    console.error("Erro ao desmarcar conteúdo como concluído:", error);
    throw error;
  }
}

// Helper function to update course progress
async function updateCourseProgress(cursoId: string, userId: string) {
  try {
    // Count total content in the course
    const { data: modulos, error: modulosError } = await supabase
      .from("modulos")
      .select("id")
      .eq("curso_id", cursoId);

    if (modulosError) throw modulosError;
    
    if (!modulos || modulos.length === 0) return;
    
    const moduloIds = modulos.map(m => m.id);
    
    // Count total conteudos in the course
    const { count: totalConteudos, error: countError } = await supabase
      .from("conteudos")
      .select("*", { count: 'exact', head: true })
      .in("modulo_id", moduloIds);
    
    if (countError) throw countError;
    
    // Count completed conteudos
    const { count: completedCount, error: completedError } = await supabase
      .from("conteudo_concluido")
      .select("*", { count: 'exact', head: true })
      .eq("user_id", userId)
      .eq("curso_id", cursoId);
    
    if (completedError) throw completedError;
    
    // Calculate percentage
    const percent = totalConteudos > 0 ? (completedCount || 0) / totalConteudos * 100 : 0;
    
    // Update enrollment progress
    const { error: updateError } = await supabase
      .from("enrollments")
      .update({
        progress: {
          percent,
          completed_lessons: completedCount || 0,
          total_lessons: totalConteudos || 0
        }
      })
      .eq("user_id", userId)
      .eq("course_id", cursoId);
    
    if (updateError) throw updateError;
    
    return {
      percent,
      completed_lessons: completedCount || 0,
      total_lessons: totalConteudos || 0
    };
  } catch (error) {
    console.error("Erro ao atualizar progresso do curso:", error);
    throw error;
  }
}
