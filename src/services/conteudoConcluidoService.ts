
import { supabase } from "@/integrations/supabase/client";

interface ConteudoConcluido {
  id?: string;
  user_id: string;
  curso_id: string;
  modulo_id: string;
  conteudo_id: string;
  created_at?: string;
}

// Marcar um conteúdo como concluído
export async function marcarConteudoConcluido(cursoId: string, moduloId: string, conteudoId: string) {
  try {
    // Obter o ID do usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    // Verificar se já está marcado como concluído
    const { data: existente } = await supabase
      .from("conteudo_concluido")
      .select()
      .eq("user_id", user.id)
      .eq("conteudo_id", conteudoId)
      .maybeSingle();
      
    // Se já estiver marcado como concluído, não fazer nada
    if (existente) {
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
    
    return data;
  } catch (error) {
    console.error("Erro ao marcar conteúdo como concluído:", error);
    throw error;
  }
}

// Desmarcar um conteúdo como concluído
export async function desmarcarConteudoConcluido(conteudoId: string) {
  try {
    // Obter o ID do usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    // Remover o registro de conteúdo concluído
    const { error } = await supabase
      .from("conteudo_concluido")
      .delete()
      .eq("user_id", user.id)
      .eq("conteudo_id", conteudoId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Erro ao desmarcar conteúdo como concluído:", error);
    throw error;
  }
}

// Verificar se um conteúdo está concluído
export async function verificarConteudoConcluido(conteudoId: string) {
  try {
    // Obter o ID do usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    // Buscar o registro de conteúdo concluído
    const { data, error } = await supabase
      .from("conteudo_concluido")
      .select()
      .eq("user_id", user.id)
      .eq("conteudo_id", conteudoId)
      .maybeSingle();
      
    if (error) throw error;
    
    return !!data; // Retorna true se o conteúdo estiver concluído, false caso contrário
  } catch (error) {
    console.error("Erro ao verificar conteúdo concluído:", error);
    return false;
  }
}

// Obter todos os conteúdos concluídos de um curso
export async function getConteudosConcluidosDoCurso(cursoId: string) {
  try {
    // Obter o ID do usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    // Buscar todos os registros de conteúdos concluídos do curso
    const { data, error } = await supabase
      .from("conteudo_concluido")
      .select("conteudo_id")
      .eq("user_id", user.id)
      .eq("curso_id", cursoId);
      
    if (error) throw error;
    
    // Retorna um array com os IDs dos conteúdos concluídos
    return data.map(item => item.conteudo_id);
  } catch (error) {
    console.error("Erro ao obter conteúdos concluídos do curso:", error);
    return [];
  }
}

// Obter estatísticas de progresso do curso
export async function getProgressoCurso(cursoId: string) {
  try {
    // Obter o ID do usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    // Contar total de conteúdos no curso
    const { count: totalConteudos, error: errorTotal } = await supabase
      .from("conteudos")
      .select("id", { count: 'exact', head: true })
      .in("modulo_id", 
        supabase.from("modulos").select("id").eq("curso_id", cursoId)
      );
      
    if (errorTotal) throw errorTotal;
    
    // Contar conteúdos concluídos
    const { count: conteudosConcluidos, error: errorConcluidos } = await supabase
      .from("conteudo_concluido")
      .select("id", { count: 'exact', head: true })
      .eq("user_id", user.id)
      .eq("curso_id", cursoId);
      
    if (errorConcluidos) throw errorConcluidos;
    
    // Calcular progresso
    const percentual = totalConteudos ? (conteudosConcluidos / totalConteudos) * 100 : 0;
    
    return {
      total: totalConteudos || 0,
      concluidos: conteudosConcluidos || 0,
      percentual: Math.round(percentual)
    };
  } catch (error) {
    console.error("Erro ao obter progresso do curso:", error);
    return {
      total: 0,
      concluidos: 0,
      percentual: 0
    };
  }
}
