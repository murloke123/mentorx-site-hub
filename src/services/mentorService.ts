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
  title: string;
  description?: string | null;
  is_public: boolean;
  is_paid: boolean;
  price?: number | null;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
  mentor_id: string;
  enrollments?: { count: number }[];
}

export async function getMentorCourses(): Promise<MentorCourse[]> {
  try {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Not authenticated");
    
    // Use proper column names that match the database
    const { data, error } = await supabase
      .from("cursos")
      .select(`
        id, 
        title, 
        description, 
        is_public, 
        is_paid, 
        price, 
        image_url, 
        created_at, 
        updated_at, 
        mentor_id,
        enrollments(count)
      `)
      .eq("mentor_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Query error:", error);
      throw error;
    }
    
    return data as MentorCourse[] || [];
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
  name: string;
  description?: string;
  course_id: string;
  created_at: string;
  updated_at: string;
  ordem: number;
  cursos?: {
    id: string;
    title: string;
  };
}

export async function getMentorModules(limit = 5): Promise<Module[]> {
  try {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Not authenticated");
    
    const { data: modules, error } = await supabase
      .from("modulos")
      .select(`
        id, 
        nome_modulo, 
        descricao_modulo, 
        curso_id, 
        created_at, 
        updated_at, 
        ordem,
        cursos!inner(id, title, mentor_id)
      `)
      .eq("cursos.mentor_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    // Transform the data to match the Module interface
    const transformedModules: Module[] = modules ? modules.map(mod => ({
      id: mod.id,
      name: mod.nome_modulo,
      description: mod.descricao_modulo,
      course_id: mod.curso_id,
      created_at: mod.created_at,
      updated_at: mod.updated_at,
      ordem: mod.ordem,
      cursos: mod.cursos ? {
        id: mod.cursos.id,
        title: mod.cursos.title
      } : undefined
    })) : [];
    
    return transformedModules;
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
    
    // Updated query to use enrollments table with new column names
    const { data: enrollments, error } = await supabase
      .from("enrollments")
      .select("enrolled_at, cursos:course_id(id, mentor_id)")
      .eq("cursos.mentor_id", user.id)
      .gte("enrolled_at", startDateStr)
      .order("enrolled_at", { ascending: true });

    if (error) throw error;
    
    // Process data for chart display
    // Group by date and count
    const enrollmentByDate = enrollments?.reduce((acc, enrollment) => {
      // Ensure enrollment.enrolled_at is not null or undefined before creating Date object
      if (enrollment.enrolled_at) {
        const date = new Date(enrollment.enrolled_at).toLocaleDateString();
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

export interface Mentor {
  id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  highlight_message: string | null;
  phone?: string | null;
  sm_tit1?: string | null;
  sm_desc1?: string | null;
  sm_tit2?: string | null;
  sm_desc2?: string | null;
  sm_tit3?: string | null;
  sm_desc3?: string | null;
  courses_count: number;
  followers_count?: number;
}

export async function getFeaturedMentors(): Promise<Mentor[]> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        avatar_url,
        bio,
        highlight_message,
        courses:cursos(count)
      `)
      .eq("role", "mentor")
      .order("updated_at", { ascending: false })
      .limit(3);

    if (error) throw error;

    return (data || []).map(mentor => ({
      id: mentor.id,
      full_name: mentor.full_name,
      avatar_url: mentor.avatar_url,
      bio: mentor.bio,
      highlight_message: mentor.highlight_message,
      courses_count: mentor.courses?.[0]?.count || 0
    }));
  } catch (error) {
    console.error("Error fetching featured mentors:", error);
    return [];
  }
}

export async function getAllPublicMentors(): Promise<Mentor[]> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        avatar_url,
        bio,
        highlight_message
      `)
      .eq("role", "mentor")
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return (data || []).map(mentor => ({
      id: mentor.id,
      full_name: mentor.full_name,
      avatar_url: mentor.avatar_url,
      bio: mentor.bio,
      highlight_message: mentor.highlight_message,
      courses_count: 0
    }));
  } catch (error) {
    console.error("Error fetching all public mentors:", error);
    return [];
  }
}
