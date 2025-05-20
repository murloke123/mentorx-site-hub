import { supabase } from '@/integrations/supabase/client';
import type { Conteudo } from './conteudoService'; 
import type { Modulo } from './moduloService';   
// import { Curso } from './courseService'; // Curso não está exportado lá

// Definição básica da interface Curso, ajuste conforme sua tabela 'cursos'
export interface Curso {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  mentor_id?: string; // Adicione outros campos relevantes da sua tabela cursos
  // ... outros campos do curso
  modulos: Modulo[]; // Nested modulos
}

export interface ModuloComConteudos extends Modulo {
  conteudos: Conteudo[];
}

export interface CursoDetalhado extends Curso {
  modulos: ModuloComConteudos[];
}

export interface ConteudoConcluido {
  id?: string;
  user_id: string;
  curso_id: string;
  modulo_id: string;
  conteudo_id: string;
  created_at?: string;
}

// Buscar detalhes completos de um curso para o player
export async function getCursoDetalhadoParaPlayer(cursoId: string): Promise<CursoDetalhado | null> {
  const { data: cursoData, error: cursoError } = await supabase
    .from('cursos') // Use o nome exato da tabela como string
    .select('*, modulos(*, conteudos(*))') // Use nomes exatos das tabelas relacionadas
    .eq('id', cursoId)
    .order('ordem', { referencedTable: 'modulos', ascending: true }) // Corrigido para referencedTable
    .order('ordem', { referencedTable: 'modulos.conteudos', ascending: true }) // Corrigido para referencedTable
    .single();

  if (cursoError) {
    console.error("Erro ao buscar detalhes do curso para player:", cursoError);
    // Não lance o erro aqui, retorne null para que a UI possa tratar
    return null;
  }
  return cursoData as any; // Usar 'as any' temporariamente devido à complexidade do tipo aninhado
}

// Buscar IDs dos conteúdos concluídos por um usuário em um curso
export async function getConteudosConcluidosPorUsuario(
  cursoId: string,
  userId: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from('conteudo_concluido') // Use o nome exato da tabela como string
    .select('conteudo_id')
    .eq('curso_id', cursoId)
    .eq('user_id', userId);

  if (error) {
    console.error("Erro ao buscar conteúdos concluídos:", error);
    return [];
  }
  // Certifique-se que data não é null e que os itens têm a propriedade conteudo_id
  return data ? data.map(item => item.conteudo_id) : [];
}

// Marcar um conteúdo como concluído
export async function marcarConteudoComoConcluido(
  dadosConclusao: Omit<ConteudoConcluido, 'id' | 'created_at'>
): Promise<ConteudoConcluido | null> {
  const { data, error } = await supabase
    .from('conteudo_concluido') // Use o nome exato da tabela como string
    .insert([dadosConclusao])    // .insert() espera um array
    .select()
    .single();
  
  if (error) {
    console.error("Erro ao marcar conteúdo como concluído:", error);
    return null;
  }
  return data as ConteudoConcluido | null;
}

// Desmarcar um conteúdo como concluído
export async function desmarcarConteudoComoConcluido(
  conteudoId: string,
  userId: string
): Promise<boolean> {
  const { error } = await supabase
    .from('conteudo_concluido') // Use o nome exato da tabela como string
    .delete()
    .eq('conteudo_id', conteudoId)
    .eq('user_id', userId);

  if (error) {
    console.error("Erro ao desmarcar conteúdo como concluído:", error);
    return false;
  }
  return true;
}

// Define interfaces based on your Supabase schema
// These might need to be adjusted if they are defined centrally and can be imported

export interface Conteudo {
  id: string;
  titulo: string;
  tipo_conteudo: 'video' | 'text' | 'pdf';
  dados_conteudo: {
    video_url?: string;
    texto_rico?: string;
    pdf_url?: string;
    pdf_filename?: string;
    // Add other potential fields from your 'conteudos' table if needed
  };
  ordem: number;
  modulo_id: string;
  created_at: string;
  updated_at: string;
}

export interface Modulo {
  id: string;
  titulo: string;
  descricao?: string;
  ordem: number;
  curso_id: string;
  created_at: string;
  updated_at: string;
  conteudos: Conteudo[]; // Nested conteudos
}

interface CourseDetailsPlayerResponse {
  curso: Curso | null;
  completedConteudoIds: string[];
}

/**
 * Fetches detailed course data for the player page, including modules, content,
 * and the user's completed content.
 */
export async function getCourseDetailsForPlayer(cursoId: string): Promise<CourseDetailsPlayerResponse> {
  if (!cursoId) {
    throw new Error("ID do curso é obrigatório.");
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // Handle case where user is not authenticated, if necessary for public courses
    // For now, assuming player is for authenticated users or RLS handles public access
    console.warn("Usuário não autenticado ao buscar detalhes do curso para o player.");
  }

  try {
    // Fetch course details
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select(\`
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
            titulo,
            tipo_conteudo,
            dados_conteudo,
            ordem,
            modulo_id,
            created_at,
            updated_at
          )
        )
      \`)
      .eq('id', cursoId)
      .maybeSingle(); // Use maybeSingle if the course might not exist or RLS prevents access

    if (courseError) throw courseError;
    if (!courseData) {
      // Consider if this should throw an error or return null for the curso
      // For now, matching the return type which allows curso to be null
      return { curso: null, completedConteudoIds: [] };
    }

    // Sort modules and their conteudos by 'ordem'
    const sortedModulos = courseData.modulos.map(modulo => ({
      ...modulo,
      conteudos: modulo.conteudos.sort((a, b) => a.ordem - b.ordem),
    })).sort((a, b) => a.ordem - b.ordem);
    
    const cursoComModulosOrdenados = { ...courseData, modulos: sortedModulos } as Curso;


    // Fetch completed content for the current user and course
    let completedConteudoIds: string[] = [];
    if (user) {
      const { data: completedData, error: completedError } = await supabase
        .from('conteudo_concluido')
        .select('conteudo_id')
        .eq('user_id', user.id)
        .eq('curso_id', cursoId);

      if (completedError) {
        console.error("Erro ao buscar conteúdos concluídos:", completedError);
        // Decide if this error should be thrown or handled gracefully
        // For now, we'll proceed without completed data if there's an error
      } else if (completedData) {
        completedConteudoIds = completedData.map(item => item.conteudo_id);
      }
    }
    
    return { curso: cursoComModulosOrdenados, completedConteudoIds };

  } catch (error) {
    console.error('Erro ao buscar detalhes do curso para o player:', error);
    // Consider how to propagate this error. Toast can be called from the component.
    if (error instanceof Error) {
        throw new Error(\`Falha ao carregar dados do curso: ${error.message.replace(/`/g, "\\`")}\`);
    }
    throw new Error("Uma falha desconhecida ocorreu ao carregar dados do curso.");
  }
}


/**
 * Marks a piece of content as completed by the user.
 */
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
    // Check for unique constraint violation (already completed) - might not be an "error" per se.
    if (error.code === '23505') { // Unique violation
        // Optionally, fetch and return the existing record or just return null/handle as success
        console.warn("Conteúdo já estava marcado como concluído.");
        // Attempt to fetch the existing record
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

/**
 * Marks a piece of content as not completed by the user.
 */
export async function markConteudoAsIncompleto(cursoId: string, moduloId: string, conteudoId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  if (!cursoId || !moduloId || !conteudoId) { // cursoId and moduloId are not strictly needed for delete by user_id and conteudo_id, but good for consistency/logging
    throw new Error("ID do conteúdo é obrigatório.");
  }

  const { error } = await supabase
    .from('conteudo_concluido')
    .delete()
    .eq('user_id', user.id)
    .eq('conteudo_id', conteudoId); // Primary key for user completion is (user_id, conteudo_id)

  if (error) {
    console.error("Erro ao marcar conteúdo como incompleto:", error);
    throw error;
  }
} 