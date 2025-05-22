
import { supabase } from "@/integrations/supabase/client";
import { Course } from "@/types";

export interface CourseFormData {
  name: string;
  description: string;
  category: string;
  image: string;
  type: "free" | "paid";
  price: number;
  currency: string;
  discount: number;
  visibility: "public" | "private";
  isPublished: boolean;
}

export async function getCourseById(courseId: string) {
  try {
    const { data, error } = await supabase
      .from("cursos")
      .select("id, title, description, is_paid, price, discount, discounted_price, image_url, is_public, is_published, category") 
      .eq("id", courseId)
      .single();
      
    if (error) {
      console.error("Erro ao buscar curso:", error);
      throw error;
    }
    
    // Convert the course data to form data format
    const courseFormData: CourseFormData = {
      name: data.title,
      description: data.description || "",
      category: data.category || "",
      image: data.image_url || "",
      type: data.is_paid ? "paid" : "free",
      price: data.price || 0,
      currency: "BRL", 
      discount: data.discount || 0,
      visibility: data.is_public ? "public" : "private",
      isPublished: data.is_published || false,
    };
    
    console.log("Dados do curso carregados:", courseFormData);
    return courseFormData;
  } catch (error) {
    console.error("Erro ao buscar curso:", error);
    throw error;
  }
}

export async function updateCourse(courseId: string, formData: CourseFormData) {
  try {
    const { error } = await supabase
      .from("cursos")
      .update({
        title: formData.name,
        description: formData.description,
        category: formData.category,
        image_url: formData.image,
        is_paid: formData.type === "paid",
        price: formData.type === "paid" ? formData.price : null,
        discount: formData.type === "paid" ? formData.discount : 0,
        is_public: formData.visibility === "public",
        is_published: formData.isPublished,
      })
      .eq("id", courseId);

    if (error) {
      console.error("Erro ao atualizar curso:", error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar curso:", error);
    throw error;
  }
}

export async function createCourse(formData: CourseFormData, mentorId: string) {
  try {
    const { data, error } = await supabase
      .from("cursos")
      .insert({
        title: formData.name,
        description: formData.description,
        category: formData.category,
        image_url: formData.image,
        is_paid: formData.type === "paid",
        price: formData.type === "paid" ? formData.price : null,
        discount: formData.type === "paid" ? formData.discount : 0,
        mentor_id: mentorId,
        is_public: formData.visibility === "public",
        is_published: formData.isPublished,
      })
      .select();

    if (error) {
      console.error("Erro ao criar curso:", error);
      throw error;
    }

    return data[0];
  } catch (error) {
    console.error("Erro ao criar curso:", error);
    throw error;
  }
}

export async function getPublicCourses() {
  try {
    let { data, error } = await supabase
      .from('cursos')
      .select(`
        id,
        title,
        description,
        mentor_id,
        is_paid,
        is_public,
        price,
        discount,
        discounted_price,
        image_url,
        is_published,
        created_at,
        updated_at,
        profiles:mentor_id (full_name)
      `)
      .eq('is_public', true)
      .eq('is_published', true);
    
    if (error) {
      console.error('Erro ao buscar cursos:', error);
      throw error;
    }

    // Format the data to match the Course type
    const formattedCourses: Course[] = data.map((course: any) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      mentor_id: course.mentor_id,
      is_public: course.is_public,
      is_paid: course.is_paid,
      price: course.price,
      discount: course.discount,
      discounted_price: course.discounted_price,
      image_url: course.image_url,
      is_published: course.is_published,
      created_at: course.created_at,
      updated_at: course.updated_at,
      mentor_name: course.profiles?.full_name,
    }));

    return formattedCourses;
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    throw error;
  }
}

export async function getMentorCourses(mentorId: string) {
  try {
    let { data, error } = await supabase
      .from('cursos')
      .select(`
        id, 
        title, 
        description, 
        mentor_id, 
        is_public, 
        is_paid, 
        price,
        discount,
        discounted_price,
        image_url, 
        is_published,
        created_at,
        updated_at,
        enrollments: enrollments (count)
      `)
      .eq('mentor_id', mentorId);

    if (error) {
      console.error('Erro ao buscar cursos do mentor:', error);
      throw error;
    }

    return data as Course[];
  } catch (error) {
    console.error('Erro ao buscar cursos do mentor:', error);
    throw error;
  }
}

export async function updateCoursePublicationStatus(courseId: string, isPublished: boolean) {
  try {
    const { error } = await supabase
      .from('cursos')
      .update({ is_published: isPublished })
      .eq('id', courseId);

    if (error) {
      console.error('Erro ao atualizar status de publicação:', error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar status de publicação:', error);
    throw error;
  }
}
