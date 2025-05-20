
import { supabase } from "@/integrations/supabase/client";

// Define interfaces for course player functionality
export interface ConteudoItem {
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

export interface CursoItem {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  mentor_id: string;
  is_paid?: boolean;
  price?: number;
  created_at: string;
  updated_at: string;
  modulos: ModuloItem[];
}

export interface CoursePlayerData {
  curso: CursoItem;
  modulos: ModuloItem[];
  completedConteudoIds: string[];
}

// Function to get course details for the player
export async function getCourseDetailsForPlayer(cursoId: string): Promise<CoursePlayerData> {
  try {
    // Fetch the course data
    const { data: curso, error: cursoError } = await supabase
      .from("cursos")
      .select("*")
      .eq("id", cursoId)
      .single();

    if (cursoError) throw cursoError;

    // Fetch the modules for the course
    const { data: modulos, error: modulosError } = await supabase
      .from("modulos")
      .select("*, conteudos(*)")
      .eq("curso_id", cursoId)
      .order("ordem", { ascending: true });

    if (modulosError) throw modulosError;

    // Get user ID for completed content check
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Fetch completed content IDs
    const { data: concluidos, error: concluidosError } = await supabase
      .from("conteudo_concluido")
      .select("conteudo_id")
      .eq("user_id", user.id)
      .eq("curso_id", cursoId);

    if (concluidosError) throw concluidosError;

    const completedConteudoIds = concluidos ? concluidos.map(item => item.conteudo_id) : [];

    // Create the properly structured course data with modules
    const cursoWithModulos: CursoItem = {
      ...curso,
      modulos: modulos as ModuloItem[]
    };

    return {
      curso: cursoWithModulos,
      modulos: modulos as ModuloItem[],
      completedConteudoIds
    };
  } catch (error) {
    console.error("Error fetching course details for player:", error);
    throw error;
  }
}

// Mark content as completed
export async function markConteudoConcluido(cursoId: string, moduloId: string, conteudoId: string) {
  try {
    // Get the user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    // Check if already marked as completed
    const { data: existing, error: checkError } = await supabase
      .from("conteudo_concluido")
      .select("id")
      .eq("user_id", user.id)
      .eq("conteudo_id", conteudoId)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existing) {
      return existing;
    }
    
    // Insert new record of completed content
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
    
    return data;
  } catch (error) {
    console.error("Error marking content as completed:", error);
    throw error;
  }
}

// Mark content as incomplete
export async function markConteudoIncompleto(cursoId: string, moduloId: string, conteudoId: string) {
  try {
    // Get the user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Delete the record
    const { error } = await supabase
      .from("conteudo_concluido")
      .delete()
      .eq("user_id", user.id)
      .eq("curso_id", cursoId)
      .eq("conteudo_id", conteudoId);

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error("Error marking content as incomplete:", error);
    throw error;
  }
}
