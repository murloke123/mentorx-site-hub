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
      title: courseData.name,
      description: courseData.description,
      is_paid: courseData.type === "paid",
      price: courseData.type === "paid" ? courseData.price : null,
      image_url: courseData.image,
      mentor_id: user.id,
      is_public: courseData.visibility === "public", // Usar o valor do campo de visibilidade
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

    // Mapear dados do formulário para o formato da tabela de cursos
    const courseRecord = {
      title: courseData.name,
      description: courseData.description,
      is_paid: courseData.type === "paid",
      price: courseData.type === "paid" ? courseData.price : null,
      image_url: courseData.image,
      is_public: courseData.visibility === "public", // Usar o valor do campo de visibilidade
      updated_at: new Date().toISOString(),
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
      .select("*")
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
      visibility: data.is_public ? "public" : "private", // Usar o valor do campo is_public
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
        *,
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

export async function getMentorCourses() {
  try {
    // Obter o ID do usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    const { data, error } = await supabase
      .from("cursos") // Changed from "courses"
      .select("*, enrollments(count)")
      .eq("mentor_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Erro ao buscar cursos do mentor:", error);
    const { toast } = useToast();
    toast({
      title: "Erro ao buscar cursos",
      description: "Não foi possível carregar seus cursos.",
      variant: "destructive",
    });
    return [];
  }
}

export async function deleteCourse(courseId: string) {
  try {
    // Obter o ID do usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Deletar o curso
    const { error } = await supabase
      .from("cursos") // Changed from "courses"
      .delete()
      .eq("id", courseId)
      .eq("mentor_id", user.id); // Garantir que apenas o mentor do curso possa deletar

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Erro ao deletar curso:", error);
    throw error;
  }
}
