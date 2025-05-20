
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface CourseContent {
  modules: Module[];
  currentModule?: Module;
  currentContent?: Content;
}

export interface Module {
  id: string;
  title: string;
  order: number;
  contents: Content[];
}

export interface Content {
  id: string;
  title: string;
  type: string;
  order: number;
  data: any;
  isCompleted?: boolean;
}

export async function getCoursePlayerData(courseId: string, userId: string): Promise<CourseContent | null> {
  try {
    // Fetch modules
    const { data: modulesData, error: modulesError } = await supabase
      .from("modulos")
      .select("*")
      .eq("curso_id", courseId)
      .order("ordem", { ascending: true });

    if (modulesError) throw modulesError;
    
    if (!modulesData || modulesData.length === 0) {
      return { modules: [] };
    }
    
    // Fetch all contents for this course's modules
    const moduleIds = modulesData.map(module => module.id);
    
    const { data: contentsData, error: contentsError } = await supabase
      .from("conteudos")
      .select("*")
      .in("modulo_id", moduleIds)
      .order("ordem", { ascending: true });
    
    if (contentsError) throw contentsError;
    
    // Get completion data for this user and course
    const { data: completionData, error: completionError } = await supabase
      .from("conteudo_concluido")
      .select("*")
      .eq("user_id", userId)
      .eq("curso_id", courseId);
    
    if (completionError) throw completionError;
    
    // Map of completed content IDs for quick lookup
    const completedContentIds = new Set(
      completionData?.map(item => item.conteudo_id) || []
    );
    
    // Organize data into the desired structure
    const modules: Module[] = modulesData.map(module => {
      // Get contents for this module
      const moduleContents = contentsData?.filter(
        content => content.modulo_id === module.id
      ) || [];
      
      // Format contents with completion status
      const contents: Content[] = moduleContents.map(content => ({
        id: content.id,
        title: content.nome_conteudo,
        type: content.tipo_conteudo,
        order: content.ordem,
        data: content.dados_conteudo,
        isCompleted: completedContentIds.has(content.id)
      }));
      
      // Return formatted module
      return {
        id: module.id,
        title: module.nome_modulo,
        order: module.ordem,
        contents: contents
      };
    });
    
    // Find the first incomplete content across all modules for initial position
    let currentModule: Module | undefined = undefined;
    let currentContent: Content | undefined = undefined;
    
    // Logic to find current position
    let foundIncomplete = false;
    
    for (const module of modules) {
      if (foundIncomplete) break;
      
      for (const content of module.contents) {
        if (!content.isCompleted) {
          currentModule = module;
          currentContent = content;
          foundIncomplete = true;
          break;
        }
      }
    }
    
    // If all content is complete, set to the last module and content
    if (!currentModule && modules.length > 0) {
      currentModule = modules[modules.length - 1];
      const moduleContents = currentModule.contents;
      currentContent = moduleContents.length > 0 ? moduleContents[moduleContents.length - 1] : undefined;
    }
    
    return {
      modules,
      currentModule,
      currentContent
    };
    
  } catch (error) {
    console.error("Error fetching course player data:", error);
    toast({
      title: "Erro ao carregar curso",
      description: "Não foi possível carregar os dados do curso.",
      variant: "destructive",
    });
    return null;
  }
}

export async function markContentAsCompleted(
  userId: string,
  courseId: string,
  moduleId: string,
  contentId: string
) {
  try {
    const { data, error } = await supabase
      .from("conteudo_concluido")
      .insert({
        user_id: userId,
        curso_id: courseId,
        modulo_id: moduleId,
        conteudo_id: contentId,
      })
      .select()
      .single();

    if (error) {
      // Check if this is just a unique constraint violation (already completed)
      if (error.code === "23505") { // Unique violation in PostgreSQL
        console.log("Conteúdo já foi marcado como concluído anteriormente");
        return true;
      }
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error marking content as completed:", error);
    toast({
      title: "Erro",
      description: "Não foi possível marcar o conteúdo como concluído.",
      variant: "destructive",
    });
    return false;
  }
}

export async function getCourseProgress(userId: string, courseId: string) {
  try {
    // First get all conteúdos for this course
    const { data: moduleData, error: moduleError } = await supabase
      .from("modulos")
      .select("id")
      .eq("curso_id", courseId);

    if (moduleError) throw moduleError;
    
    if (!moduleData || moduleData.length === 0) {
      return { completed: 0, total: 0, percentage: 0 };
    }
    
    const moduleIds = moduleData.map(module => module.id);

    // Get all conteúdos for these modules
    const { data: contentData, error: contentError } = await supabase
      .from("conteudos")
      .select("id")
      .in("modulo_id", moduleIds);
      
    if (contentError) throw contentError;
    
    const totalContents = contentData?.length || 0;
    
    if (totalContents === 0) {
      return { completed: 0, total: 0, percentage: 0 };
    }
    
    // Now get completed contents
    const { data: completedData, error: completedError } = await supabase
      .from("conteudo_concluido")
      .select("conteudo_id")
      .eq("user_id", userId)
      .eq("curso_id", courseId);
      
    if (completedError) throw completedError;
    
    const completedContents = completedData?.length || 0;
    
    // Calculate percentage
    const percentage = totalContents > 0 
      ? Math.round((completedContents / totalContents) * 100) 
      : 0;
      
    return {
      completed: completedContents,
      total: totalContents,
      percentage: percentage
    };
    
  } catch (error) {
    console.error("Error getting course progress:", error);
    return { completed: 0, total: 0, percentage: 0 };
  }
}
