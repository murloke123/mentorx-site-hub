
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

    // Now using English field names
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

    // Insert the course using English field names
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

    // Now using English field names
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

    // Update the course using English field names
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
      .select("id, title, description, is_paid, price, image_url, is_public, is_published") 
      .eq("id", courseId)
      .single();
      
    if (error) throw error;
    
    // Convert the course data to form data format
    const courseFormData: CourseFormData = {
      name: data.title,
      description: data.description || "",
      category: "", // This field needs to be filled with the actual category
      image: data.image_url || "",
      type: data.is_paid ? "paid" : "free",
      price: data.price || 0,
      currency: "BRL", // This field needs to be filled with the actual currency
      discount: 0, // This field needs to be filled with the actual discount
      visibility: data.is_public ? "public" : "private",
      isPublished: data.is_published || false,
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
  created_at?: string;
  updated_at?: string;
  mentor_name?: string;
}

// Get mentor courses
export async function getMentorCourses(): Promise<Course[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('getMentorCourses called without an authenticated user.');
      return [];
    }

    // First try the RPC function
    try {
      console.log('[DEBUG] Supabase RPC call for getMentorCourses:', { 
        rpc: 'obter_detalhes_cursos_do_mentor',
        params: { p_mentor_id: user.id } 
      });
      
      const { data, error } = await supabase
        .rpc('obter_detalhes_cursos_do_mentor', { p_mentor_id: user.id });
        
      if (error) {
        console.error('Error fetching mentor courses via RPC:', error);
        throw error;
      }
      
      return data || [];
    } catch (rpcError) {
      console.error('Exception in getMentorCourses (RPC catch block):', rpcError);
      
      // Fallback to direct query if RPC fails
      const { data, error } = await supabase
        .from("cursos")
        .select(`
          id, 
          title, 
          description, 
          mentor_id,
          is_public, 
          is_paid, 
          price, 
          image_url, 
          is_published, 
          created_at, 
          updated_at,
          enrollments(count)
        `)
        .eq("mentor_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error('Error fetching mentor courses:', error);
        throw error;
      }
      
      return data || [];
    }
  } catch (error) {
    console.error('Exception in getMentorCourses:', error);
    return [];
  }
}

// Get public courses
export async function getPublicCourses(): Promise<Course[]> {
  try {
    const { data: coursesData, error } = await supabase
      .from('cursos')
      .select(`
        id,
        title, 
        description,
        mentor_id,
        is_paid,
        is_public,
        price,
        image_url,
        is_published,
        created_at,
        profiles:mentor_id (full_name)
      `)
      .eq('is_public', true)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    console.log('[DEBUG] Fetched public courses:', coursesData);
    
    return (coursesData || []).map(data => ({
      id: data.id,
      title: data.title,
      description: data.description || "",
      mentor_id: data.mentor_id,
      mentor_name: data.profiles?.full_name,
      is_public: data.is_public,
      is_paid: data.is_paid,
      price: data.price || 0,
      image_url: data.image_url || undefined,
      is_published: data.is_published || false
    }));
  } catch (error) {
    console.error('Error fetching public courses:', error);
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
