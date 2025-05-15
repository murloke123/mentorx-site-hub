
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export async function getMentorProfile() {
  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", supabase.auth.getUser()?.data.user?.id)
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

export async function getMentorCourses() {
  try {
    const { data: courses, error } = await supabase
      .from("courses")
      .select("*, enrollments(count)")
      .eq("mentor_id", supabase.auth.getUser()?.data.user?.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return courses;
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

export async function getMentorModules(limit = 5) {
  try {
    const { data: modules, error } = await supabase
      .from("modules")
      .select("*, courses!inner(*)")
      .eq("courses.mentor_id", supabase.auth.getUser()?.data.user?.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return modules;
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

export async function getMentorFollowersCount() {
  try {
    const { count, error } = await supabase
      .from("mentor_followers")
      .select("*", { count: "exact", head: true })
      .eq("mentor_id", supabase.auth.getUser()?.data.user?.id);

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

export async function getEnrollmentStats(periodDays = 30) {
  try {
    // Calculate the date X days ago
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);
    
    // Format date for Supabase query
    const startDateStr = startDate.toISOString();
    
    const { data: enrollments, error } = await supabase
      .from("enrollments")
      .select("enrolled_at, courses!inner(*)")
      .eq("courses.mentor_id", supabase.auth.getUser()?.data.user?.id)
      .gte("enrolled_at", startDateStr)
      .order("enrolled_at", { ascending: true });

    if (error) throw error;
    
    // Process data for chart display
    // Group by date and count
    const enrollmentByDate = enrollments?.reduce((acc, enrollment) => {
      const date = new Date(enrollment.enrolled_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {}) || {};
    
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
