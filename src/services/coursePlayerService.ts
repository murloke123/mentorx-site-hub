
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Json } from "@/integrations/supabase/types";

// Define proper interfaces matching the database structure
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

export const getCourseDetailsForPlayer = async (cursoId: string): Promise<CourseDetailsPlayerResponse> => {
  try {
    // Obter o ID do usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Obter detalhes do curso
    const { data: curso, error: cursoError } = await supabase
      .from("cursos")
      .select("id, title, description, mentor_id, image_url")
      .eq("id", cursoId)
      .single();
    
    if (cursoError) throw cursoError;
    if (!curso) throw new Error("Curso não encontrado");
    
    // Obter módulos do curso
    const { data: modulos, error: modulosError } = await supabase
      .from("modulos")
      .select(`
        id, 
        nome_modulo, 
        descricao_modulo,
        ordem,
        curso_id,
        created_at,
        updated_at
      `)
      .eq("curso_id", cursoId)
      .order("ordem", { ascending: true });
    
    if (modulosError) throw modulosError;
    
    // Para cada módulo, obter seus conteúdos
    const modulosWithConteudos: Modulo[] = [];
    
    for (const modulo of modulos) {
      const { data: conteudos, error: conteudosError } = await supabase
        .from("conteudos")
        .select(`
          id, 
          nome_conteudo,
          tipo_conteudo,
          dados_conteudo,
          ordem,
          modulo_id,
          created_at,
          updated_at
        `)
        .eq("modulo_id", modulo.id)
        .order("ordem", { ascending: true });
      
      if (conteudosError) throw conteudosError;
      
      // Cast conteúdo tipo_conteudo to the specific union type
      const typedConteudos = conteudos.map(conteudo => ({
        ...conteudo,
        tipo_conteudo: conteudo.tipo_conteudo as 'video' | 'text' | 'pdf'
      }));
      
      modulosWithConteudos.push({
        ...modulo,
        conteudos: typedConteudos
      });
    }
    
    // Obter IDs de conteúdos já concluídos pelo usuário
    const { data: completedContent, error: completedError } = await supabase
      .from("conteudo_concluido")
      .select("conteudo_id")
      .eq("user_id", user.id)
      .eq("curso_id", cursoId);
    
    if (completedError) throw completedError;
    
    const completedConteudoIds = completedContent.map(item => item.conteudo_id);
    
    // Construir objeto de resposta
    const courseDetails: CourseDetailsPlayerResponse = {
      curso: {
        ...curso,
        modulos: modulosWithConteudos
      },
      completedConteudoIds
    };
    
    return courseDetails;
  } catch (error) {
    console.error("Erro ao buscar detalhes do curso:", error);
    throw error;
  }
};

export const markConteudoConcluido = async (cursoId: string, moduloId: string, conteudoId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
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
};

export const markConteudoIncompleto = async (cursoId: string, moduloId: string, conteudoId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    const { data, error } = await supabase
      .from("conteudo_concluido")
      .delete()
      .match({
        user_id: user.id,
        curso_id: cursoId,
        modulo_id: moduloId,
        conteudo_id: conteudoId
      })
      .select();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Erro ao marcar conteúdo como incompleto:", error);
    throw error;
  }
};
