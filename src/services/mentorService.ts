import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export async function getMentorProfile() {
  try {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Not authenticated");
    
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) throw error;
    return profile;
  } catch (error) {
    console.error("Error fetching mentor profile:", error);
    toast({
      title: "Error fetching profile",
      description: "Your profile information could not be loaded.",
      variant: "destructive",
    });
    return null;
  }
}

export interface MentorCourse {
  id: string;
  titulo: string;
  descricao?: string | null;
  eh_publico: boolean;
  eh_pago: boolean;
  preco?: number | null;
  url_imagem?: string | null;
  criado_em: string;
  atualizado_em: string;
  mentor_id: string;
  inscricoes?: { count: number }[];
}

export async function getMentorCourses(): Promise<MentorCourse[]> {
  try {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Not authenticated");
    
    const { data: courses, error } = await supabase
      .from("cursos")
      .select("id, titulo, descricao, eh_publico, eh_pago, preco, url_imagem, criado_em, atualizado_em, mentor_id, inscricoes(count)")
      .eq("mentor_id", user.id)
      .order("criado_em", { ascending: false });

    if (error) throw error;
    return courses || [];
  } catch (error) {
    console.error("Error fetching mentor courses:", error);
    toast({
      title: "Error fetching courses",
      description: "Your courses could not be loaded.",
      variant: "destructive",
    });
    return [];
  }
}

export interface Module {
  id: string;
  nome_modulo: string;
  descricao_modulo?: string;
  curso_id: string;
  criado_em: string;
  atualizado_em: string;
  ordem: number;
  cursos?: {
    id: string;
    titulo: string;
  };
}

export async function getMentorModules(limit = 5): Promise<Module[]> {
  try {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Not authenticated");
    
    const { data: modules, error } = await supabase
      .from("modulos")
      .select("id, nome_modulo, descricao_modulo, curso_id, criado_em, atualizado_em, ordem, cursos!inner(id, titulo, mentor_id)")
      .eq("cursos.mentor_id", user.id)
      .order("criado_em", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return modules || [];
  } catch (error) {
    console.error("Error fetching mentor modules:", error);
    toast({
      title: "Error fetching modules",
      description: "Your recent modules could not be loaded.",
      variant: "destructive",
    });
    return [];
  }
}

export async function getMentorFollowersCount(): Promise<number> {
  try {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Not authenticated");
    
    const { count, error } = await supabase
      .from("mentor_followers")
      .select("*", { count: "exact", head: true })
      .eq("mentor_id", user.id);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error("Error fetching follower count:", error);
    toast({
      title: "Error fetching followers",
      description: "Your follower count could not be loaded.",
      variant: "destructive",
    });
    return 0;
  }
}

export interface EnrollmentDataPoint {
  date: string;
  count: number;
}

export async function getEnrollmentStats(periodDays = 30): Promise<EnrollmentDataPoint[]> {
  try {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Not authenticated");
    
    // Calculate the date X days ago
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);
    
    // Format date for Supabase query
    const startDateStr = startDate.toISOString();
    
    // Querying 'inscricoes' table with Portuguese column names
    const { data: enrollments, error } = await supabase // Variable name 'enrollments' kept for simplicity, but it queries 'inscricoes'
      .from("inscricoes") // Changed from enrollments
      .select("data_inscricao, cursos!inner(id, mentor_id)") // Changed from enrolled_at, selecting only necessary fields from cursos
      .eq("cursos.mentor_id", user.id) // Ensure this join condition is correct based on your schema
      .gte("data_inscricao", startDateStr) // Changed from enrolled_at
      .order("data_inscricao", { ascending: true }); // Changed from enrolled_at

    if (error) throw error;
    
    // Process data for chart display
    // Group by date and count
    const enrollmentByDate = enrollments?.reduce((acc, enrollment) => {
      // Ensure enrollment.data_inscricao is not null or undefined before creating Date object
      if (enrollment.data_inscricao) {
        const date = new Date(enrollment.data_inscricao).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>) || {};
    
    // Convert to array format for charts
    const chartData = Object.entries(enrollmentByDate).map(([date, count]) => ({
      date,
      count,
    }));
    
    return chartData;
  } catch (error) {
    console.error("Error fetching enrollment stats:", error);
    toast({
      title: "Error fetching enrollment data",
      description: "Enrollment statistics could not be loaded.",
      variant: "destructive",
    });
    return [];
  }
}
