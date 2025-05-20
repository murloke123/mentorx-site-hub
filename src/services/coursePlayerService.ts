
import { supabase } from "@/integrations/supabase/client";

export interface Modulo {
  id: string;
  nome_modulo: string;
  descricao: string | null;
  ordem: number;
  curso_id: string;
  created_at: string;
  updated_at: string;
  conteudos?: Conteudo[];
}

// Update the Conteudo type to match what's needed
interface DadosConteudo {
  video_url?: string;
  texto_rico?: string;
  pdf_url?: string;
  pdf_filename?: string;
}

export interface Conteudo {
  id: string;
  nome_conteudo: string;
  tipo_conteudo: "video" | "text" | "pdf";
  dados_conteudo: DadosConteudo;
  ordem: number;
  modulo_id: string;
  created_at: string;
  updated_at: string;
}

export interface CursoItem {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  mentor_id: string;
  modulos: ModuloItem[];
}

export interface ModuloItem {
  id: string;
  nome_modulo: string;
  descricao_modulo?: string;
  ordem: number;
  curso_id: string;
  created_at: string;
  updated_at: string;
  conteudos: ConteudoItem[];
}

export interface ConteudoItem {
  id: string;
  nome_conteudo: string;
  tipo_conteudo: "video" | "text" | "pdf";
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

export const getCourseDetailsForPlayer = async (cursoId: string) => {
  try {
    // Get the course details
    const { data: curso, error: cursoError } = await supabase
      .from('cursos')
      .select('*')
      .eq('id', cursoId)
      .single();

    if (cursoError) throw cursoError;

    // Get the modules for this course
    const { data: modulos, error: modulosError } = await supabase
      .from('modulos')
      .select(`
        *,
        conteudos (*)
      `)
      .eq('curso_id', cursoId)
      .order('ordem', { ascending: true });

    if (modulosError) throw modulosError;

    // Get completed content for this user
    const { data: completedContent, error: completedError } = await supabase
      .from('conteudo_concluido')
      .select('conteudo_id')
      .eq('curso_id', cursoId);

    if (completedError) throw completedError;

    const completedConteudoIds = completedContent?.map(item => item.conteudo_id) || [];

    // Process modules and content data
    const processedModulos = modulos?.map(modulo => {
      return {
        ...modulo,
        conteudos: modulo.conteudos?.map(conteudo => {
          return {
            ...conteudo,
            tipo_conteudo: conteudo.tipo_conteudo as "video" | "text" | "pdf",
            dados_conteudo: typeof conteudo.dados_conteudo === 'string'
              ? JSON.parse(conteudo.dados_conteudo)
              : conteudo.dados_conteudo
          };
        }).sort((a, b) => a.ordem - b.ordem) || []
      };
    });

    return {
      curso,
      modulos: processedModulos,
      completedConteudoIds
    };
  } catch (error) {
    console.error("Error fetching course details for player:", error);
    throw error;
  }
};

export const markConteudoConcluido = async (cursoId: string, moduloId: string, conteudoId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from('conteudo_concluido')
      .insert({
        curso_id: cursoId,
        modulo_id: moduloId,
        conteudo_id: conteudoId,
        user_id: user.id
      });

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error marking content as completed:", error);
    throw error;
  }
};

export const markConteudoIncompleto = async (cursoId: string, moduloId: string, conteudoId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from('conteudo_concluido')
      .delete()
      .eq('curso_id', cursoId)
      .eq('modulo_id', moduloId)
      .eq('conteudo_id', conteudoId)
      .eq('user_id', user.id);

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error marking content as incomplete:", error);
    throw error;
  }
};

export const getCourseModules = async (courseId: string) => {
  try {
    const { data: modulos, error } = await supabase
      .from('modulos')
      .select(`
        *,
        conteudos (
          *
        )
      `)
      .eq('curso_id', courseId)
      .order('ordem', { ascending: true });

    if (error) {
      console.error("Erro ao buscar módulos:", error);
      return [];
    }

    return mapModulos(modulos);
  } catch (error) {
    console.error("Erro ao buscar módulos:", error);
    return [];
  }
};

// Update the mapConteudo function to properly handle the datos_conteudo type conversion
const mapConteudo = (conteudo: any): Conteudo => {
  return {
    ...conteudo,
    tipo_conteudo: conteudo.tipo_conteudo as "video" | "text" | "pdf",
    dados_conteudo: typeof conteudo.dados_conteudo === 'string'
      ? JSON.parse(conteudo.dados_conteudo)
      : conteudo.dados_conteudo
  };
};

// Then update the part where you map modulos to properly map conteudos
export const mapModulos = (modulosData: any): Modulo[] => {
  if (!modulosData) return [];
  
  return modulosData.map((modulo: any) => ({
    ...modulo,
    conteudos: modulo.conteudos ? modulo.conteudos.map(mapConteudo) : []
  }));
};
