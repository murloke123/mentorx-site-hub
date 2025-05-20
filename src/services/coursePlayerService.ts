
import { supabase } from "@/integrations/supabase/client";
import { CursoItemLocal, ModuloItemLocal, ConteudoItemLocal } from "@/pages/mentor/cursos/types";

// Função para obter detalhes do curso para o player
export async function getCourseDetailsForPlayer(cursoId: string) {
  try {
    // Obter dados do curso
    const { data: curso, error: cursoError } = await supabase
      .from("cursos")
      .select("*")
      .eq("id", cursoId)
      .single();
    
    if (cursoError) throw cursoError;
    
    // Obter módulos do curso
    const { data: modulos, error: modulosError } = await supabase
      .from("modulos")
      .select("*, conteudos(*)")
      .eq("curso_id", cursoId)
      .order("ordem", { ascending: true });
    
    if (modulosError) throw modulosError;
    
    // Obter IDs de conteúdos já concluídos pelo usuário
    const { data: { user } } = await supabase.auth.getUser();
    
    let completedConteudoIds: string[] = [];
    if (user) {
      const { data: conteudosConcluidos, error: concluidosError } = await supabase
        .from("conteudo_concluido")
        .select("conteudo_id")
        .eq("user_id", user.id)
        .eq("curso_id", cursoId);
      
      if (!concluidosError && conteudosConcluidos) {
        completedConteudoIds = conteudosConcluidos.map(cc => cc.conteudo_id);
      }
    }
    
    return {
      curso: curso as unknown as CursoItemLocal,
      modulos: modulos as unknown as ModuloItemLocal[],
      completedConteudoIds
    };
    
  } catch (error) {
    console.error("Erro ao buscar detalhes do curso:", error);
    throw error;
  }
}

// Função para marcar um conteúdo como concluído
export async function markConteudoConcluido(cursoId: string, moduloId: string, conteudoId: string) {
  try {
    // Verificar se o usuário está autenticado
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Inserir registro de conteúdo concluído
    const { data, error } = await supabase
      .from("conteudo_concluido")
      .insert({
        user_id: user.id,
        curso_id: cursoId,
        modulo_id: moduloId,
        conteudo_id: conteudoId
      })
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao marcar conteúdo como concluído:", error);
    throw error;
  }
}

// Função para desmarcar um conteúdo como concluído (remover)
export async function markConteudoIncompleto(cursoId: string, moduloId: string, conteudoId: string) {
  try {
    // Verificar se o usuário está autenticado
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Remover registro de conteúdo concluído
    const { error } = await supabase
      .from("conteudo_concluido")
      .delete()
      .match({
        user_id: user.id,
        curso_id: cursoId,
        conteudo_id: conteudoId
      });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Erro ao desmarcar conteúdo como concluído:", error);
    throw error;
  }
}
