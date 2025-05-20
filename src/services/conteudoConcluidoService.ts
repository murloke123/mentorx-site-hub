
import { supabase } from "@/integrations/supabase/client";

interface ConteudoConcluido {
  id?: string;
  user_id: string;
  curso_id: string;
  modulo_id: string;
  conteudo_id: string;
}

interface Progress {
  percent: number;
  completed_lessons: number;
  total_lessons: number;
}

export async function marcarConteudoConcluido(cursoId: string, moduloId: string, conteudoId: string) {
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
      .eq("conteudo_id", conteudoId)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existente) {
      // Se já está marcado como concluído, apenas retorna
      return existente;
    }
    
    // Inserir novo registro de conteúdo concluído
    const conteudoConcluido: ConteudoConcluido = {
      user_id: user.id,
      curso_id: cursoId,
      modulo_id: moduloId,
      conteudo_id: conteudoId
    };
    
    const { data, error } = await supabase
      .from("conteudo_concluido")
      .insert(conteudoConcluido)
      .select()
      .single();

    if (error) throw error;

    // Atualizar o progresso do curso
    await atualizarProgressoCurso(cursoId);
    
    return data;
  } catch (error) {
    console.error("Erro ao marcar conteúdo como concluído:", error);
    throw error;
  }
}

export async function desmarcarConteudoConcluido(conteudoId: string) {
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
      .eq("conteudo_id", conteudoId)
      .maybeSingle();
      
    if (fetchError) throw fetchError;
    
    if (!registro) {
      // Se não encontrado, retorna
      return null;
    }

    const cursoId = registro.curso_id;
    
    // Excluir o registro
    const { error } = await supabase
      .from("conteudo_concluido")
      .delete()
      .eq("user_id", user.id)
      .eq("conteudo_id", conteudoId);

    if (error) throw error;

    // Atualizar o progresso do curso
    await atualizarProgressoCurso(cursoId);
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao desmarcar conteúdo como concluído:", error);
    throw error;
  }
}

export async function verificarConteudoConcluido(conteudoId: string) {
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
      .eq("conteudo_id", conteudoId)
      .maybeSingle();

    if (error) throw error;
    
    return !!data; // Retorna true se o conteúdo estiver concluído
  } catch (error) {
    console.error("Erro ao verificar se conteúdo está concluído:", error);
    return false;
  }
}

async function atualizarProgressoCurso(cursoId: string) {
  try {
    // Obter o ID do usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    // Contar total de conteúdos no curso
    const { count: totalConteudos, error: totalError } = await supabase
      .from("conteudos")
      .select("id", { count: 'exact', head: true })
      .eq("modulo_id", "modulos.id")
      .eq("modulos.curso_id", cursoId);
      
    if (totalError) throw totalError;
    
    if (!totalConteudos || totalConteudos === 0) return;
    
    // Contar conteúdos concluídos pelo usuário
    const { count: concluidos, error: concluidosError } = await supabase
      .from("conteudo_concluido")
      .select("id", { count: 'exact', head: true })
      .eq("user_id", user.id)
      .eq("curso_id", cursoId);
      
    if (concluidosError) throw concluidosError;
    
    const percentual = (concluidos || 0) / totalConteudos * 100;
    
    // Criar objeto de progresso com a forma correta
    const progress: Progress = {
      percent: percentual,
      completed_lessons: concluidos || 0,
      total_lessons: totalConteudos
    };
    
    // Atualizar a matrícula com o progresso
    const { error: updateError } = await supabase
      .from("enrollments")
      .update({ progress })
      .eq("user_id", user.id)
      .eq("course_id", cursoId);
      
    if (updateError) throw updateError;
  } catch (error) {
    console.error("Erro ao atualizar progresso do curso:", error);
    throw error;
  }
}
