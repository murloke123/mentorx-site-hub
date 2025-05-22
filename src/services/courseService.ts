
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

    // Mapear dados do formulário para o formato da tabela de cursos
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

    // Mapear dados do formulário para o formato da tabela de cursos
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
      .select("id, titulo, descricao, eh_pago, preco, url_imagem, eh_publico, foi_publicado") 
      .eq("id", courseId)
      .single();
      
    if (error) throw error;
    
    // Converter os dados do curso para o formato do formulário
    const courseFormData: CourseFormData = {
      name: data.titulo,
      description: data.descricao || "",
      category: "", // Este campo precisa ser preenchido com a categoria real
      image: data.url_imagem || "",
      type: data.eh_pago ? "paid" : "free",
      price: data.preco || 0,
      currency: "BRL", // Este campo precisa ser preenchido com a moeda real
      discount: 0, // Este campo precisa ser preenchido com o desconto real
      visibility: data.eh_publico ? "public" : "private",
      isPublished: data.foi_publicado || false,
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
  created_at?: string;
  updated_at?: string;
  mentor_name?: string;
}

// Buscar cursos do mentor
export async function getMentorCourses(): Promise<Course[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('getMentorCourses called without an authenticated user.');
      return [];
    }

    // Tentar primeiro a função RPC
    try {
      console.log('[DEBUG] Supabase RPC call for getMentorCourses:', { 
        rpc: 'obter_detalhes_cursos_do_mentor',
        params: { p_mentor_id: user.id } 
      });
      
      const { data, error } = await supabase
        .rpc('obter_detalhes_cursos_do_mentor', { p_mentor_id: user.id });
        
      if (error) {
        console.error('Erro ao buscar cursos do mentor via RPC:', error);
        throw error;
      }
      
      return data || [];
    } catch (rpcError) {
      console.error('Exceção em getMentorCourses (RPC catch block):', rpcError);
      
      // Fallback para consulta direta se a RPC falhar
      const { data, error } = await supabase
        .from("cursos")
        .select(`
          id, 
          titulo, 
          descricao, 
          mentor_id,
          eh_publico, 
          eh_pago, 
          preco, 
          url_imagem, 
          foi_publicado, 
          criado_em, 
          atualizado_em,
          enrollments(count)
        `)
        .eq("mentor_id", user.id)
        .order("criado_em", { ascending: false });

      if (error) {
        console.error('Erro ao buscar cursos do mentor:', error);
        throw error;
      }
      
      // Map response to our Course interface
      return (data || []).map(item => ({
        id: item.id,
        title: item.titulo,
        description: item.descricao,
        mentor_id: item.mentor_id,
        is_public: item.eh_publico,
        is_paid: item.eh_pago,
        price: item.preco,
        image_url: item.url_imagem,
        is_published: item.foi_publicado || false,
        enrollments: item.enrollments ? [{ count: item.enrollments.length }] : [],
        created_at: item.criado_em,
        updated_at: item.atualizado_em
      }));
    }
  } catch (error) {
    console.error('Exceção em getMentorCourses:', error);
    return [];
  }
}

// Buscar cursos públicos
export async function getPublicCourses(): Promise<Course[]> {
  try {
    const { data: coursesData, error } = await supabase
      .from('cursos')
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
        criado_em,
        profiles:mentor_id (full_name)
      `)
      .eq('eh_publico', true)
      .eq('foi_publicado', true)
      .order('criado_em', { ascending: false });

    if (error) throw error;
    
    console.log('[DEBUG] Fetched public courses:', coursesData);
    
    return (coursesData || []).map(data => ({
      id: data.id,
      title: data.titulo,
      description: data.descricao || "",
      mentor_id: data.mentor_id,
      mentor_name: data.profiles?.full_name,
      is_public: data.eh_publico,
      is_paid: data.eh_pago,
      price: data.preco || 0,
      image_url: data.url_imagem || undefined,
      is_published: data.foi_publicado || false
    }));
  } catch (error) {
    console.error('Erro ao buscar cursos públicos:', error);
    throw error;
  }
}

export async function deleteCourse(courseId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

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
