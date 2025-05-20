
import { supabase } from "@/integrations/supabase/client";

// Modify the function signature to use the query context parameter
export async function getAllCourses(context?: { queryKey: string[], signal?: AbortSignal }) {
  const limit = typeof context === 'object' ? 100 : (context || 100);
  
  try {
    const { data, error } = await supabase
      .from("cursos")
      .select(`
        id, 
        title, 
        description, 
        mentor_id, 
        is_paid, 
        price, 
        created_at,
        profiles:mentor_id (full_name)
      `)
      .order('created_at', { ascending: false })
      .limit(typeof limit === 'number' ? limit : 100);

    if (error) throw error;

    // Calculate enrollment count for each course
    const coursesWithEnrollments = await Promise.all(
      data.map(async (course) => {
        const { count, error: countError } = await supabase
          .from('enrollments')
          .select('*', { count: 'exact', head: true })
          .eq('course_id', course.id);

        if (countError) {
          console.error("Erro ao contar matrículas:", countError);
          return { 
            ...course, 
            enrollments_count: 0,
            mentor_name: course.profiles?.full_name
          };
        }

        return {
          ...course,
          mentor_name: course.profiles?.full_name,
          enrollments_count: count || 0
        };
      })
    );

    return coursesWithEnrollments;
  } catch (error) {
    console.error("Erro ao buscar todos os cursos:", error);
    throw error;
  }
}

// Função para deletar um curso
export async function deleteCourse(courseId: string) {
  try {
    const { error } = await supabase
      .from("cursos")
      .delete()
      .eq("id", courseId);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Erro ao deletar curso:", error);
    throw error;
  }
}

// Função para obter o perfil do administrador
export async function getAdminProfile() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Usuário não autenticado");
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Erro ao buscar perfil admin:", error);
    return null;
  }
}

// Função para obter estatísticas da plataforma
export async function getPlatformStats() {
  try {
    // Contagem de mentores
    const { count: mentorsCount, error: mentorsError } = await supabase
      .from("profiles")
      .select("*", { count: 'exact', head: true })
      .eq("role", "mentor");
      
    if (mentorsError) throw mentorsError;
    
    // Contagem de mentorados
    const { count: mentoreesCount, error: mentoreesError } = await supabase
      .from("profiles")
      .select("*", { count: 'exact', head: true })
      .eq("role", "mentorado");
      
    if (mentoreesError) throw mentoreesError;
    
    // Contagem de cursos
    const { count: coursesCount, error: coursesError } = await supabase
      .from("cursos")
      .select("*", { count: 'exact', head: true });
      
    if (coursesError) throw coursesError;
    
    // Contagem de matrículas
    const { count: enrollmentsCount, error: enrollmentsError } = await supabase
      .from("enrollments")
      .select("*", { count: 'exact', head: true });
      
    if (enrollmentsError) throw enrollmentsError;
    
    return {
      mentorsCount: mentorsCount || 0,
      mentoreesCount: mentoreesCount || 0,
      coursesCount: coursesCount || 0,
      enrollmentsCount: enrollmentsCount || 0
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas da plataforma:", error);
    return {
      mentorsCount: 0,
      mentoreesCount: 0,
      coursesCount: 0,
      enrollmentsCount: 0
    };
  }
}

// Função para obter todos os mentores (updated function signature)
export async function getAllMentors(context?: { queryKey: string[], signal?: AbortSignal }) {
  const limit = typeof context === 'object' ? 100 : (context || 100);
  
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        avatar_url,
        bio
      `)
      .eq("role", "mentor")
      .limit(typeof limit === 'number' ? limit : 100);
      
    if (error) throw error;
    
    // Calcular estatísticas para cada mentor
    const mentorsWithStats = await Promise.all(
      data.map(async (mentor) => {
        // Contar cursos
        const { count: coursesCount, error: coursesError } = await supabase
          .from("cursos")
          .select("*", { count: 'exact', head: true })
          .eq("mentor_id", mentor.id);
          
        if (coursesError) {
          console.error(`Erro ao contar cursos do mentor ${mentor.id}:`, coursesError);
          return { ...mentor, courses_count: 0, followers_count: 0 };
        }
        
        // Contar seguidores
        const { count: followersCount, error: followersError } = await supabase
          .from("mentor_followers")
          .select("*", { count: 'exact', head: true })
          .eq("mentor_id", mentor.id);
          
        if (followersError) {
          console.error(`Erro ao contar seguidores do mentor ${mentor.id}:`, followersError);
          return { ...mentor, courses_count: coursesCount || 0, followers_count: 0 };
        }
        
        return {
          ...mentor,
          courses_count: coursesCount || 0,
          followers_count: followersCount || 0
        };
      })
    );
    
    return mentorsWithStats;
  } catch (error) {
    console.error("Erro ao buscar mentores:", error);
    return [];
  }
}

// Função para obter todos os mentorados (updated function signature)
export async function getAllMentorados(context?: { queryKey: string[], signal?: AbortSignal }) {
  const limit = typeof context === 'object' ? 100 : (context || 100);
  
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        avatar_url,
        bio
      `)
      .eq("role", "mentorado")
      .limit(typeof limit === 'number' ? limit : 100);
      
    if (error) throw error;
    
    // Calcular estatísticas para cada mentorado
    const mentoreesWithStats = await Promise.all(
      data.map(async (mentoree) => {
        // Contar matrículas
        const { count: enrollmentsCount, error: enrollmentsError } = await supabase
          .from("enrollments")
          .select("*", { count: 'exact', head: true })
          .eq("user_id", mentoree.id);
          
        if (enrollmentsError) {
          console.error(`Erro ao contar matrículas do mentorado ${mentoree.id}:`, enrollmentsError);
          return { ...mentoree, enrollments_count: 0 };
        }
        
        return {
          ...mentoree,
          enrollments_count: enrollmentsCount || 0
        };
      })
    );
    
    return mentoreesWithStats;
  } catch (error) {
    console.error("Erro ao buscar mentorados:", error);
    return [];
  }
}

// Função para deletar um usuário
export async function deleteUser(userId: string) {
  try {
    // Note: em uma aplicação real, você precisaria de permissões de administrador 
    // ou usar Supabase Edge Functions para deletar usuários
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    throw error;
  }
}
