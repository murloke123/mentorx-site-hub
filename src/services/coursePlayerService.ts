import { supabase } from "@/integrations/supabase/client";

// Define interfaces based on your Supabase schema.
// Ideally, these would align with or be imported from Supabase-generated types if available,
// or from other service files if they export them (e.g., Conteudo from conteudoService).

// Using 'titulo' for Conteudo to match CoursePlayerPage, but original conteudoService uses 'nome_conteudo' for table 'conteudos'.
// This might need alignment later if issues arise or if we consolidate types.
export interface Conteudo {
  id: string;
  titulo: string; // CoursePlayerPage.tsx uses 'titulo'. conteudoService.ts uses 'nome_conteudo' for table 'conteudos'.
  tipo_conteudo: 'video' | 'text' | 'pdf' | 'video_externo' | 'texto_rico'; // Expanded to include types from conteudoService & player page
  dados_conteudo: {
    video_url?: string;    // Used by player page for 'video' type
    texto_rico?: string;   // Used by player page for 'text' type (maps to html_content from conteudoService)
    pdf_url?: string;        // Used by player page for 'pdf' type
    pdf_filename?: string; // Used by player page for 'pdf' type
    html_content?: string; // from conteudoService for 'texto_rico'
    provider?: 'youtube' | 'vimeo'; // from conteudoService for 'video_externo'
    url?: string;            // from conteudoService for 'video_externo'
    storage_path?: string;   // from conteudoService for 'pdf'
  };
  ordem: number;
  modulo_id: string;
  created_at: string;
  updated_at: string;
}

export interface Modulo {
  id: string;
  titulo: string; // Assuming module table uses 'titulo' or similar for name
  descricao?: string;
  ordem: number;
  curso_id: string;
  created_at: string;
  updated_at: string;
  conteudos: Conteudo[];
}

// Using 'title' for Curso to match CoursePlayerPage. Table 'cursos' likely has 'title'.
export interface Curso {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  mentor_id: string;
  modulos: Modulo[];
}

export interface ConteudoConcluido {
  id?: string;
  user_id: string;
  curso_id: string;
  modulo_id: string;
  conteudo_id: string;
  created_at?: string;
}

interface CourseDetailsPlayerResponse {
  curso: Curso | null;
  completedConteudoIds: string[];
}

export async function getCourseDetailsForPlayer(cursoId: string): Promise<CourseDetailsPlayerResponse> {
  if (!cursoId) {
    throw new Error("ID do curso é obrigatório.");
  }

  const { data: { user } } = await supabase.auth.getUser();

  try {
    // Fetch course details, using 'cursos' table and assuming 'modulos' and 'conteudos' relations
    // The select string needs to match your actual column names and relationships.
    const { data: courseData, error: courseError } = await supabase
      .from('cursos') // Using 'cursos' table name
      .select(`
        id,
        title,
        description,
        image_url,
        mentor_id,
        modulos (
          id,
          titulo,
          descricao,
          ordem,
          curso_id,
          created_at,
          updated_at,
          conteudos (
            id,
            nome_conteudo:titulo, /* Corrected Alias: original_column:new_name */
            tipo_conteudo,
            dados_conteudo,
            ordem,
            modulo_id,
            created_at,
            updated_at
          )
        )
      `)
      .eq('id', cursoId)
      .maybeSingle();

    if (courseError) throw courseError;
    if (!courseData) {
      return { curso: null, completedConteudoIds: [] };
    }

    // Ensure modulos and their conteudos are sorted by 'ordem'
    const sortedModulos = (courseData.modulos || []).map(modulo => ({
      ...modulo,
      conteudos: (modulo.conteudos || []).map(c => ({
        ...c,
        // titulo: c.nome_conteudo, // This aliasing is now done in the SQL select, if supported
        // If SQL alias doesn't work as expected due to Supabase client limitations or type issues,
        // manual mapping might be needed here after fetching c.nome_conteudo
      })).sort((a: Conteudo, b: Conteudo) => a.ordem - b.ordem),
    })).sort((a: Modulo, b: Modulo) => a.ordem - b.ordem);

    const cursoProcessed = { ...courseData, modulos: sortedModulos } as unknown as Curso;

    let completedConteudoIds: string[] = [];
    if (user) {
      const { data: completedData, error: completedError } = await supabase
        .from('conteudo_concluido')
        .select('conteudo_id')
        .eq('user_id', user.id)
        .eq('curso_id', cursoId);

      if (completedError) {
        console.error("Erro ao buscar conteúdos concluídos:", completedError);
      } else if (completedData) {
        completedConteudoIds = completedData.map((item: { conteudo_id: string }) => item.conteudo_id);
      }
    }

    return { curso: cursoProcessed, completedConteudoIds };
  } catch (error) {
    console.error('Erro ao buscar detalhes do curso para o player:', error);
    if (error instanceof Error) {
      throw new Error(`Falha ao carregar dados do curso: ${error.message.replace(/`/g, "\\`")}`);
    }
    throw new Error("Uma falha desconhecida ocorreu ao carregar dados do curso.");
  }
}

export async function markConteudoAsConcluido(cursoId: string, moduloId: string, conteudoId: string): Promise<ConteudoConcluido | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  if (!cursoId || !moduloId || !conteudoId) {
    throw new Error("IDs do curso, módulo e conteúdo são obrigatórios.");
  }

  const { data, error } = await supabase
    .from('conteudo_concluido')
    .insert({
      user_id: user.id,
      curso_id: cursoId,
      modulo_id: moduloId,
      conteudo_id: conteudoId,
    })
    .select()
    .single();

  if (error) {
    console.error("Erro ao marcar conteúdo como concluído:", error);
    if (error.code === '23505') { // Unique violation
      console.warn("Conteúdo já estava marcado como concluído.");
      const { data: existingData, error: fetchError } = await supabase
        .from('conteudo_concluido')
        .select('*')
        .eq('user_id', user.id)
        .eq('conteudo_id', conteudoId)
        .single();
      if (fetchError) throw fetchError;
      return existingData as ConteudoConcluido;
    }
    throw error;
  }
  return data as ConteudoConcluido;
}

export async function markConteudoAsIncompleto(cursoId: string, moduloId: string, conteudoId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  if (!conteudoId) {
    throw new Error("ID do conteúdo é obrigatório.");
  }

  const { error } = await supabase
    .from('conteudo_concluido')
    .delete()
    .eq('user_id', user.id)
    .eq('conteudo_id', conteudoId);

  if (error) {
    console.error("Erro ao marcar conteúdo como incompleto:", error);
    throw error;
  }
}
