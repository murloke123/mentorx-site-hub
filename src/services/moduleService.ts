
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Module {
  id: string;
  title: string;
  description: string | null;
  course_id: string;
  module_order: number;
  is_free: boolean;
  content_type: string;
  created_at: string;
  updated_at: string;
}

export async function getModulesByCourse(courseId: string): Promise<Module[]> {
  try {
    const { data, error } = await supabase
      .from("modules")
      .select("*")
      .eq("course_id", courseId)
      .order("module_order", { ascending: true });

    if (error) throw error;
    
    return (data || []) as Module[];
  } catch (error) {
    console.error("Error fetching modules:", error);
    const { toast } = useToast();
    toast({
      title: "Erro ao carregar módulos",
      description: "Não foi possível carregar os módulos do curso.",
      variant: "destructive",
    });
    return [];
  }
}

export async function createModule(moduleData: Partial<Module>) {
  try {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Usuário não autenticado");
    
    // Verify that the user is the course owner
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("mentor_id")
      .eq("id", moduleData.course_id)
      .single();
      
    if (courseError) throw courseError;
    if (course.mentor_id !== user.id) throw new Error("Você não tem permissão para adicionar módulos a este curso");
    
    // Get the highest module_order for this course
    const { data: modules, error: orderError } = await supabase
      .from("modules")
      .select("module_order")
      .eq("course_id", moduleData.course_id)
      .order("module_order", { ascending: false })
      .limit(1);
      
    if (orderError) throw orderError;
    
    const nextOrder = modules && modules.length > 0 ? modules[0].module_order + 1 : 0;
    
    // Ensure required properties are present
    if (!moduleData.course_id) throw new Error("Course ID is required");
    if (!moduleData.title) throw new Error("Title is required");
    
    const { data, error } = await supabase
      .from("modules")
      .insert({
        course_id: moduleData.course_id,
        title: moduleData.title,
        description: moduleData.description || null,
        is_free: moduleData.is_free || false,
        module_order: nextOrder,
        content_type: moduleData.content_type || 'section',
      })
      .select()
      .single();

    if (error) throw error;
    
    return data as Module;
  } catch (error) {
    console.error("Error creating module:", error);
    throw error;
  }
}

export async function updateModule(moduleId: string, moduleData: Partial<Module>) {
  try {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Usuário não autenticado");
    
    // Verify module belongs to a course owned by the user
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
    if (course.mentor_id !== user.id) throw new Error("Você não tem permissão para editar este módulo");
    
    const { data, error } = await supabase
      .from("modules")
      .update(moduleData)
      .eq("id", moduleId)
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error updating module:", error);
    throw error;
  }
}

export async function deleteModule(moduleId: string) {
  try {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Usuário não autenticado");
    
    // Verify module belongs to a course owned by the user
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
    if (course.mentor_id !== user.id) throw new Error("Você não tem permissão para excluir este módulo");
    
    // Delete all lessons in the module first
    const { error: lessonsError } = await supabase
      .from("lessons")
      .delete()
      .eq("module_id", moduleId);
      
    if (lessonsError) throw lessonsError;
    
    // Then delete the module
    const { error } = await supabase
      .from("modules")
      .delete()
      .eq("id", moduleId);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error deleting module:", error);
    throw error;
  }
}

export async function reorderModules(courseId: string, moduleOrder: { id: string, order: number }[]) {
  try {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Usuário não autenticado");
    
    // Verify the user owns the course
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("mentor_id")
      .eq("id", courseId)
      .single();
      
    if (courseError) throw courseError;
    if (course.mentor_id !== user.id) throw new Error("Você não tem permissão para reordenar módulos deste curso");
    
    // Create an array of update promises
    const updatePromises = moduleOrder.map(item => 
      supabase
        .from("modules")
        .update({ module_order: item.order })
        .eq("id", item.id)
    );
    
    // Execute all updates
    await Promise.all(updatePromises);
    
    return true;
  } catch (error) {
    console.error("Error reordering modules:", error);
    throw error;
  }
}
