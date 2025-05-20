
import { supabase } from "@/integrations/supabase/client";

// Define proper interfaces to match the actual database schema
export interface Conteudo {
  id: string;
  nome_conteudo: string;
  tipo_conteudo: 'video' | 'text' | 'pdf';
  dados_conteudo: {
    video_url?: string;
    texto_rico?: string;
    pdf_url?: string;
    pdf_filename?: string;
  };
  ordem: number;
  modulo_id: string;
  created_at: string;
  updated_at: string;
}

export interface Modulo {
  id: string;
  nome_modulo: string;
  descricao_modulo?: string;
  ordem: number;
  curso_id: string;
  created_at: string;
  updated_at: string;
  conteudos: Conteudo[];
}

export interface Curso {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  mentor_id: string;
  modulos: Modulo[];
}

export interface CourseDetailsPlayerResponse {
  curso: Curso;
  completedConteudoIds: string[];
}

export async function getCourseDetailsForPlayer(cursoId: string): Promise<CourseDetailsPlayerResponse> {
  try {
    // Obter detalhes do curso
    const { data: curso, error: cursoError } = await supabase
      .from("cursos")
      .select("id, title, description, image_url, mentor_id")
      .eq("id", cursoId)
      .single();

    if (cursoError) throw cursoError;
    if (!curso) throw new Error("Curso não encontrado");

    // Obter módulos e conteúdos
    const { data: modulos, error: modulosError } = await supabase
      .from("modulos")
      .select(`
        id,
        nome_modulo,
        descricao_modulo,
        ordem,
        curso_id,
        created_at,
        updated_at,
        conteudos (
          id,
          nome_conteudo,
          tipo_conteudo,
          dados_conteudo,
          ordem,
          modulo_id,
          created_at,
          updated_at
        )
      `)
      .eq("curso_id", cursoId)
      .order("ordem", { ascending: true });

    if (modulosError) throw modulosError;

    // Obter conteúdos concluídos pelo usuário
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    const { data: concluidos, error: concluidosError } = await supabase
      .from("conteudo_concluido")
      .select("conteudo_id")
      .eq("curso_id", cursoId)
      .eq("user_id", user.id);

    if (concluidosError) throw concluidosError;

    // Mapear IDs de conteúdos concluídos
    const completedConteudoIds = concluidos ? concluidos.map(c => c.conteudo_id) : [];

    // Construir a resposta
    const courseData: Curso = {
      ...curso,
      modulos: modulos || []
    };

    return {
      curso: courseData,
      completedConteudoIds
    };
  } catch (error) {
    console.error("Erro ao buscar detalhes do curso para o player:", error);
    throw error;
  }
}

export async function markConteudoAsConcluido(cursoId: string, moduloId: string, conteudoId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    const { error } = await supabase.from("conteudo_concluido").insert({
      user_id: user.id,
      curso_id: cursoId,
      modulo_id: moduloId,
      conteudo_id: conteudoId
    });

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao marcar conteúdo como concluído:", error);
    throw error;
  }
}

export async function markConteudoAsIncompleto(cursoId: string, moduloId: string, conteudoId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    const { error } = await supabase.from("conteudo_concluido")
      .delete()
      .eq("user_id", user.id)
      .eq("curso_id", cursoId)
      .eq("modulo_id", moduloId)
      .eq("conteudo_id", conteudoId);

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao desmarcar conteúdo como concluído:", error);
    throw error;
  }
}
