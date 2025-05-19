
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Lesson {
  id: string;
  title: string;
  content: string | null;
  type: "text" | "pdf" | "video";
  file_url: string | null;
  video_url: string | null;
  module_id: string;
  lesson_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export async function getLessonsByModule(moduleId: string) {
  try {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("module_id", moduleId)
      .order("lesson_order", { ascending: true });

    if (error) throw error;
    
    // Ensure the returned data conforms to the Lesson type
    return (data || []) as Lesson[];
  } catch (error) {
    console.error("Error fetching lessons:", error);
    const { toast } = useToast();
    toast({
      title: "Erro ao carregar conteúdos",
      description: "Não foi possível carregar os conteúdos do módulo.",
      variant: "destructive",
    });
    return [];
  }
}

export async function createLesson(lessonData: Partial<Lesson>) {
  try {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Usuário não autenticado");
    
    // Verify that the user owns the course that contains this module
    const { data: module, error: moduleError } = await supabase
      .from("modules")
      .select("course_id")
      .eq("id", lessonData.module_id)
      .single();
      
    if (moduleError) throw moduleError;
    
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("mentor_id")
      .eq("id", module.course_id)
      .single();
      
    if (courseError) throw courseError;
    if (course.mentor_id !== user.id) throw new Error("Você não tem permissão para adicionar conteúdo a este módulo");
    
    // Get the highest lesson_order for this module
    const { data: lessons, error: orderError } = await supabase
      .from("lessons")
      .select("lesson_order")
      .eq("module_id", lessonData.module_id)
      .order("lesson_order", { ascending: false })
      .limit(1);
      
    if (orderError) throw orderError;
    
    const nextOrder = lessons && lessons.length > 0 ? lessons[0].lesson_order + 1 : 0;
    
    // Ensure required properties are present
    if (!lessonData.module_id || !lessonData.title || !lessonData.type) {
      throw new Error("Dados de lição inválidos: module_id, title e type são obrigatórios");
    }
    
    const { data, error } = await supabase
      .from("lessons")
      .insert({
        module_id: lessonData.module_id,
        title: lessonData.title,
        type: lessonData.type,
        content: lessonData.content || null,
        file_url: lessonData.file_url || null,
        video_url: lessonData.video_url || null,
        lesson_order: nextOrder,
        is_published: lessonData.is_published !== undefined ? lessonData.is_published : true
      })
      .select()
      .single();

    if (error) throw error;
    
    return data as Lesson;
  } catch (error) {
    console.error("Error creating lesson:", error);
    throw error;
  }
}

export async function updateLesson(lessonId: string, lessonData: Partial<Lesson>) {
  try {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Usuário não autenticado");
    
    // Verify lesson belongs to a module in a course owned by the user
    const { data: lesson, error: lessonError } = await supabase
      .from("lessons")
      .select("module_id")
      .eq("id", lessonId)
      .single();
      
    if (lessonError) throw lessonError;
    
    const { data: module, error: moduleError } = await supabase
      .from("modules")
      .select("course_id")
      .eq("id", lesson.module_id)
      .single();
      
    if (moduleError) throw moduleError;
    
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("mentor_id")
      .eq("id", module.course_id)
      .single();
      
    if (courseError) throw courseError;
    if (course.mentor_id !== user.id) throw new Error("Você não tem permissão para editar este conteúdo");
    
    const { data, error } = await supabase
      .from("lessons")
      .update(lessonData)
      .eq("id", lessonId)
      .select()
      .single();

    if (error) throw error;
    
    return data as Lesson;
  } catch (error) {
    console.error("Error updating lesson:", error);
    throw error;
  }
}

export async function deleteLesson(lessonId: string) {
  try {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Usuário não autenticado");
    
    // Verify lesson belongs to a module in a course owned by the user
    const { data: lesson, error: lessonError } = await supabase
      .from("lessons")
      .select("*")  // Select all fields to access file_url later
      .eq("id", lessonId)
      .single();
      
    if (lessonError) throw lessonError;
    
    const { data: module, error: moduleError } = await supabase
      .from("modules")
      .select("course_id")
      .eq("id", lesson.module_id)
      .single();
      
    if (moduleError) throw moduleError;
    
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("mentor_id")
      .eq("id", module.course_id)
      .single();
      
    if (courseError) throw courseError;
    if (course.mentor_id !== user.id) throw new Error("Você não tem permissão para excluir este conteúdo");
    
    // Delete the lesson
    const { error } = await supabase
      .from("lessons")
      .delete()
      .eq("id", lessonId);

    if (error) throw error;
    
    // If lesson has a file_url, delete the file from storage
    if (lesson.file_url) {
      const filePath = lesson.file_url.split('/').pop();
      if (filePath) {
        await supabase.storage
          .from('course_content')
          .remove([filePath]);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting lesson:", error);
    throw error;
  }
}

export async function reorderLessons(moduleId: string, lessonOrder: { id: string, order: number }[]) {
  try {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Usuário não autenticado");
    
    // Verify the module belongs to a course owned by the user
    const { data: module, error: moduleError } = await supabase
      .from("modules")
      .select("course_id")
      .eq("id", moduleId)
      .single();
      
    if (moduleError) throw moduleError;
    
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("mentor_id")
      .eq("id", module.course_id)
      .single();
      
    if (courseError) throw courseError;
    if (course.mentor_id !== user.id) throw new Error("Você não tem permissão para reordenar conteúdos deste módulo");
    
    // Create an array of update promises
    const updatePromises = lessonOrder.map(item => 
      supabase
        .from("lessons")
        .update({ lesson_order: item.order })
        .eq("id", item.id)
    );
    
    // Execute all updates
    await Promise.all(updatePromises);
    
    return true;
  } catch (error) {
    console.error("Error reordering lessons:", error);
    throw error;
  }
}

export async function uploadPdfFile(file: File) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Usuário não autenticado");
    
    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from('course_content')
      .upload(fileName, file);
      
    if (error) throw error;
    
    // Get public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from('course_content')
      .getPublicUrl(fileName);
      
    return publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
