import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CourseFormData } from "@/components/mentor/course-form/FormSchema";

export type { CourseFormData } from "@/components/mentor/course-form/FormSchema";

export async function createCourse(courseData: CourseFormData) {
  try {
    // Obter o ID do usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Mapear dados do formulário para o formato da tabela de cursos (colunas em PORTUGUÊS)
    const courseRecord = {
      titulo: courseData.name,
      descricao: courseData.description,
      eh_pago: courseData.type === "paid",
      preco: courseData.type === "paid" ? courseData.price : null,
      url_imagem: courseData.image,
      mentor_id: user.id,
      eh_publico: courseData.visibility === "public",
      foi_publicado: courseData.isPublished,
    };

    // Inserir o curso no Supabase
    const { data, error } = await supabase
      .from("cursos") // Changed from "courses"
      .insert(courseRecord)
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Erro ao criar curso:", error);
    throw error;
  }
}

export async function updateCourse(courseId: string, courseData: CourseFormData) {
  try {
    // Obter o ID do usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Mapear dados do formulário para o formato da tabela de cursos (colunas em PORTUGUÊS)
    const courseRecord = {
      titulo: courseData.name,
      descricao: courseData.description,
      eh_pago: courseData.type === "paid",
      preco: courseData.type === "paid" ? courseData.price : null,
      url_imagem: courseData.image,
      eh_publico: courseData.visibility === "public",
      foi_publicado: courseData.isPublished,
      atualizado_em: new Date().toISOString(),
    };

    // Atualizar o curso no Supabase
    const { data, error } = await supabase
      .from("cursos") // Changed from "courses"
      .update(courseRecord)
      .eq("id", courseId)
      .eq("mentor_id", user.id) // Garantir que apenas o mentor do curso possa atualizar
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Erro ao atualizar curso:", error);
    throw error;
  }
}

export async function getCourseById(courseId: string) {
  try {
    const { data, error } = await supabase
      .from("cursos") // Changed from "courses"
      .select("id, titulo, descricao, eh_pago, preco, url_imagem, eh_publico") // Selecting specific Portuguese fields
      .eq("id", courseId)
      .single();
      
    if (error) throw error;
    
    // Converter os dados do curso para o formato do formulário
    const courseFormData: CourseFormData = {
      name: data.titulo, // Changed from data.title
      description: data.descricao || "", // Changed from data.description
      category: "", // Este campo precisa ser preenchido com a categoria real
      image: data.url_imagem || "", // Changed from data.image_url
      type: data.eh_pago ? "paid" : "free", // Changed from data.is_paid
      price: data.preco || 0, // Changed from data.price
      currency: "BRL", // Este campo precisa ser preenchido com a moeda real
      discount: 0, // Este campo precisa ser preenchido com o desconto real
      visibility: data.eh_publico ? "public" : "private", // Changed from data.is_public
    };
    
    return courseFormData;
  } catch (error) {
    console.error("Erro ao buscar curso:", error);
    throw error;
  }
}

export async function getCourseDetails(courseId: string) {
  try {
    const { data, error } = await supabase
      .from("cursos")
      .select(`
        id, titulo, descricao, mentor_id, eh_publico, eh_pago, preco, url_imagem, foi_publicado, criado_em, atualizado_em,
        mentor:profiles(full_name, avatar_url)
      `)
      .eq("id", courseId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching course details:", error);
    throw error;
  }
}

export interface Course {
  id: string;
  titulo: string;
  descricao?: string | null;
  mentor_id: string;
  eh_publico: boolean;
  eh_pago: boolean;
  preco?: number | null;
  url_imagem?: string | null;
  foi_publicado?: boolean;
  inscricoes?: { contagem: number }[];
  media_avaliacoes?: number | null;
  total_avaliacoes?: number | null;
}

// Buscar cursos do mentor
export async function getMentorCourses(): Promise<Course[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('getMentorCourses called without an authenticated user.');
      return [];
    }

    const { data: rpcData, error: rpcError } = await supabase
      .rpc('obter_detalhes_cursos_do_mentor', { p_mentor_id: user.id });

    console.log('[DEBUG] Supabase RPC call for getMentorCourses:', {
      rpc: 'obter_detalhes_cursos_do_mentor',
      params: { p_mentor_id: user.id }
    });

    if (rpcError) {
      console.error('Erro ao buscar cursos do mentor via RPC:', rpcError);
      throw rpcError;
    }
    
    console.log('[DEBUG] Data received from RPC getMentorCourses:', rpcData);

    // RPC retorna um array de objetos com os nomes das colunas definidos na função SQL
    return (rpcData || []).map(dataFromRpc => ({
      id: dataFromRpc.id,
      titulo: dataFromRpc.titulo,
      descricao: dataFromRpc.descricao,
      mentor_id: dataFromRpc.mentor_id,
      eh_publico: dataFromRpc.eh_publico,
      eh_pago: dataFromRpc.eh_pago,
      preco: dataFromRpc.preco,
      url_imagem: dataFromRpc.url_imagem,
      foi_publicado: dataFromRpc.foi_publicado || false,
      inscricoes: [{ contagem: Number(dataFromRpc.contagem_inscricoes) || 0 }],
      media_avaliacoes: dataFromRpc.media_avaliacoes ? Number(dataFromRpc.media_avaliacoes) : null,
      total_avaliacoes: Number(dataFromRpc.total_avaliacoes) || 0
      // Removido mentor_name pois a RPC não o retorna diretamente.
      // Se necessário, a RPC pode ser modificada para incluir o nome do mentor via join com profiles.
    }));
  } catch (error) {
    console.error('Exceção em getMentorCourses (RPC catch block):', error);
    throw error;
  }
}

// Buscar cursos públicos
export async function getPublicCourses(): Promise<Course[]> {
  try {
    const { data: coursesData, error } = await supabase
      .from('cursos') // Se 'cursos' foi renomeada, ajuste aqui também
      .select(`
        id,
        titulo, 
        descricao,
        mentor_id,
        eh_pago,
        eh_publico,
        preco,
        url_imagem,
        foi_publicado,
        criado_em, // Added criado_em for ordering
        mentor:profiles(full_name) // Assumindo que profiles.full_name é o nome do mentor
      `)
      .eq('eh_publico', true) // Usando coluna traduzida
      .eq('foi_publicado', true) // Adicionando filtro para cursos publicados
      .order('criado_em', { ascending: false }); // Changed from created_at

    if (error) throw error;
    
    console.log('[DEBUG] Fetched public courses:', coursesData);
    
    return (coursesData || []).map(data => ({
      id: data.id,
      titulo: data.titulo,
      descricao: data.descricao || "",
      mentor_id: data.mentor_id,
      eh_publico: data.eh_publico,
      eh_pago: data.eh_pago,
      preco: data.preco || 0,
      url_imagem: data.url_imagem || undefined,
      foi_publicado: data.foi_publicado || false,
      inscricoes: [], 
      media_avaliacoes: null, 
      total_avaliacoes: 0 
      // mentor_nome can be added if data.mentor.full_name is mapped here
    }));
  } catch (error) {
    console.error('Erro ao buscar cursos públicos:', error);
    // Removendo toast daqui para ser tratado pelo chamador (React Query)
    throw error; // Lançar o erro para React Query tratar
  }
}

// Função para atualizar apenas o status de publicação de um curso
export async function setCoursePublishedStatus(courseId: string, foiPublicado: boolean) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    const { data, error } = await supabase
      .from("cursos")
      .update({ foi_publicado: foiPublicado, atualizado_em: new Date().toISOString() })
      .eq("id", courseId)
      .eq("mentor_id", user.id) // Garantir que apenas o mentor possa alterar
      .select("id, foi_publicado") // Retorna o ID e o novo status para confirmação
      .single();

    if (error) {
      console.error("Erro ao atualizar status de publicação:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Exceção em setCoursePublishedStatus:", error);
    throw error;
  }
}

export async function deleteCourse(courseId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    // Ajuste 'cursos' e 'mentor_id' se foram renomeados na tabela 'cursos'
    const { error } = await supabase
      .from("cursos") 
      .delete()
      .eq("id", courseId)
      .eq("mentor_id", user.id); 

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Erro ao deletar curso:", error);
    throw error;
  }
}
