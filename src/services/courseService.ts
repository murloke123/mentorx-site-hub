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

    // Mapear dados do formulário para o formato da tabela de cursos (colunas em INGLÊS)
    const courseRecord = {
      title: courseData.name,
      description: courseData.description,
      is_paid: courseData.type === "paid",
      price: courseData.type === "paid" ? courseData.price : null,
      image_url: courseData.image,
      mentor_id: user.id,
      is_public: courseData.visibility === "public",
      is_published: courseData.isPublished,
    };

    // Inserir o curso no Supabase
    const { data, error } = await supabase
      .from("cursos")
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

    // Mapear dados do formulário para o formato da tabela de cursos (colunas em INGLÊS)
    const courseRecord = {
      title: courseData.name,
      description: courseData.description,
      is_paid: courseData.type === "paid",
      price: courseData.type === "paid" ? courseData.price : null,
      image_url: courseData.image,
      is_public: courseData.visibility === "public",
      is_published: courseData.isPublished,
      updated_at: new Date().toISOString(),
    };

    // Atualizar o curso no Supabase
    const { data, error } = await supabase
      .from("cursos")
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
      .from("cursos")
      .select("id, title, description, is_paid, price, image_url, is_public") // Usando nomes de colunas em inglês
      .eq("id", courseId)
      .single();
      
    if (error) throw error;
    
    // Converter os dados do curso para o formato do formulário
    const courseFormData: CourseFormData = {
      name: data.title,
      description: data.description || "",
      category: "", // Este campo precisa ser preenchido com a categoria real
      image: data.image_url || "",
      type: data.is_paid ? "paid" : "free",
      price: data.price || 0,
      currency: "BRL", // Este campo precisa ser preenchido com a moeda real
      discount: 0, // Este campo precisa ser preenchido com o desconto real
      visibility: data.is_public ? "public" : "private",
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
        id, title, description, mentor_id, is_public, is_paid, price, image_url, is_published, created_at, updated_at,
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
  title: string;
  description?: string | null;
  mentor_id: string;
  is_public: boolean;
  is_paid: boolean;
  price?: number | null;
  image_url?: string | null;
  is_published?: boolean;
  enrollments?: { count: number }[];
  average_rating?: number | null;
  total_ratings?: number | null;
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
      title: dataFromRpc.title,
      description: dataFromRpc.description,
      mentor_id: dataFromRpc.mentor_id,
      is_public: dataFromRpc.is_public,
      is_paid: dataFromRpc.is_paid,
      price: dataFromRpc.price,
      image_url: dataFromRpc.image_url,
      is_published: dataFromRpc.is_published || false,
      enrollments: [{ count: Number(dataFromRpc.enrollment_count) || 0 }],
      average_rating: dataFromRpc.average_rating ? Number(dataFromRpc.average_rating) : null,
      total_ratings: Number(dataFromRpc.total_ratings) || 0
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
        title, 
        description,
        mentor_id,
        is_paid,
        is_public,
        price,
        image_url,
        foi_publicado,
        criado_em, // Added criado_em for ordering
        mentor:profiles(full_name) // Assumindo que profiles.full_name é o nome do mentor
      `)
      .eq('is_public', true) // Usando coluna traduzida
      .eq('foi_publicado', true) // Adicionando filtro para cursos publicados
      .order('criado_em', { ascending: false }); // Changed from created_at

    if (error) throw error;
    
    console.log('[DEBUG] Fetched public courses:', coursesData);
    
    return (coursesData || []).map(data => ({
      id: data.id,
      title: data.title,
      description: data.descricao || "",
      mentor_id: data.mentor_id,
      is_public: data.is_public,
      is_paid: data.is_paid,
      price: data.preco || 0,
      image_url: data.url_imagem || undefined,
      foi_publicado: data.foi_publicado || false,
      enrollments: [], 
      average_rating: null, 
      total_ratings: 0 
      // mentor_nome can be added if data.mentor.full_name is mapped here
    }));
  } catch (error) {
    console.error('Erro ao buscar cursos públicos:', error);
    // Removendo toast daqui para ser tratado pelo chamador (React Query)
    throw error; // Lançar o erro para React Query tratar
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
