import { supabase } from "@/integrations/supabase/client";
import { QueryKey } from "@tanstack/react-query";

// Get admin profile
export async function getAdminProfile() {
  try {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Not authenticated");
    
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .eq("role", "admin")
      .single();

    if (error) throw error;
    return profile;
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    return null;
  }
}

// Get all mentors
export async function getAllMentors({ signal }: { queryKey: QueryKey, signal?: AbortSignal }) {
  try {
    // Fixed SQL query to avoid parsing errors
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        id, 
        full_name, 
        avatar_url, 
        bio,
        courses_count:cursos(count)
      `)
      .eq("role", "mentor")
      .order("full_name", { ascending: true });

    if (error) throw error;
    
    return data.map(mentor => ({
      id: mentor.id,
      full_name: mentor.full_name,
      avatar_url: mentor.avatar_url,
      bio: mentor.bio,
      // Ensure courses_count is a number
      courses_count: typeof mentor.courses_count === 'number' ? 
        mentor.courses_count : 
        Array.isArray(mentor.courses_count) ? mentor.courses_count.length : 0,
      followers_count: 0 // Adding the missing followers_count field
    }));
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return [];
  }
}

// Get all mentorados
export async function getAllMentorados({ signal }: { queryKey: QueryKey, signal?: AbortSignal }) {
  try {
    // Fixed SQL query
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        id, 
        full_name, 
        avatar_url, 
        bio,
        enrollments_count:enrollments(count)
      `)
      .eq("role", "mentorado")
      .order("full_name", { ascending: true });

    if (error) throw error;
    
    return data.map(mentorado => ({
      id: mentorado.id,
      full_name: mentorado.full_name,
      avatar_url: mentorado.avatar_url,
      bio: mentorado.bio,
      // Ensure enrollments_count is a number
      enrollments_count: typeof mentorado.enrollments_count === 'number' ? 
        mentorado.enrollments_count : 
        Array.isArray(mentorado.enrollments_count) ? mentorado.enrollments_count.length : 0
    }));
  } catch (error) {
    console.error("Error fetching mentorados:", error);
    return [];
  }
}

// Platform stats summary
export async function getPlatformStats() {
  try {
    // Get count of mentors
    const { count: mentorsCount, error: mentorsError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "mentor");
      
    if (mentorsError) throw mentorsError;
    
    // Get count of mentorees
    const { count: mentoreesCount, error: mentoreesError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "mentorado");
      
    if (mentoreesError) throw mentoreesError;
    
    // Get count of courses
    const { count: coursesCount, error: coursesError } = await supabase
      .from("cursos")
      .select("*", { count: "exact", head: true });
      
    if (coursesError) throw coursesError;
    
    // Get count of enrollments
    const { count: enrollmentsCount, error: enrollmentsError } = await supabase
      .from("enrollments")
      .select("*", { count: "exact", head: true });
      
    if (enrollmentsError) throw enrollmentsError;
    
    return {
      mentorsCount: mentorsCount || 0,
      mentoreesCount: mentoreesCount || 0,
      coursesCount: coursesCount || 0,
      enrollmentsCount: enrollmentsCount || 0,
    };
  } catch (error) {
    console.error("Error fetching platform stats:", error);
    return {
      mentorsCount: 0,
      mentoreesCount: 0,
      coursesCount: 0,
      enrollmentsCount: 0,
    };
  }
}

// Get all courses for admin
export async function getAllCourses({ signal }: { queryKey: QueryKey, signal?: AbortSignal }) {
  try {
    // Fixed SQL query
    const { data, error } = await supabase
      .from("cursos")
      .select(`
        id, 
        title, 
        description, 
        mentor_id,
        mentor:profiles!mentor_id(full_name),
        is_paid,
        price,
        created_at,
        enrollments(count)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    return data.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      mentor_id: course.mentor_id,
      mentor_name: course.mentor?.full_name || null,
      is_paid: course.is_paid,
      price: course.price,
      created_at: course.created_at,
      enrollments_count: typeof course.enrollments === 'number' ? 
        course.enrollments : 
        Array.isArray(course.enrollments) ? course.enrollments.length : 0
    }));
  } catch (error) {
    console.error("Error fetching all courses:", error);
    return [];
  }
}

// Delete course (admin function)
export async function deleteCourse(courseId: string) {
  try {
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Not authenticated");
    
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
      
    if (profileError) throw profileError;
    
    if (profile.role !== "admin") {
      throw new Error("Not authorized: Admin role required");
    }
    
    // Delete course
    const { error } = await supabase
      .from("cursos")
      .delete()
      .eq("id", courseId);
      
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
}

// Log admin action
export async function logAdminAction(actionType: string, targetType: string, targetId: string, details?: any) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Not authenticated");
    
    const { data, error } = await supabase
      .from("admin_actions")
      .insert({
        admin_id: user.id,
        action_type: actionType,
        target_type: targetType,
        target_id: targetId,
        details: details
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error logging admin action:", error);
    return null;
  }
}

// Get recent admin actions
export async function getAdminActions(limit = 10) {
  try {
    const { data, error } = await supabase
      .from("admin_actions")
      .select(`
        id,
        action_type,
        target_type,
        target_id,
        details,
        created_at,
        profiles:admin_id (full_name, avatar_url)
      `)
      .order("created_at", { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error fetching admin actions:", error);
    return [];
  }
}

export async function deleteUser(userId: string) {
  try {
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Not authenticated");
    
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
      
    if (profileError) throw profileError;
    
    if (profile.role !== "admin") {
      throw new Error("Not authorized: Admin role required");
    }
    
    // Delete user's profile first
    const { error: profileDeleteError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);
      
    if (profileDeleteError) throw profileDeleteError;

    // Log the admin action
    await logAdminAction("delete", "user", userId);
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
