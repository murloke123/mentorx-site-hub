
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Debug = () => {
  const [debugInfo, setDebugInfo] = useState({
    isLoggedIn: false,
    userId: "",
    userRole: "",
  });

  useEffect(() => {
    console.info("Debug: Checking user session");
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.info("Debug: Auth state changed:", event);
        
        if (session) {
          // Get user role if session exists
          supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single()
            .then(({ data, error }) => {
              const role = data?.role || "unknown";
              console.info("Debug: User role:", role);
              
              setDebugInfo({
                isLoggedIn: true,
                userId: session.user.id,
                userRole: role,
              });
            });
        } else {
          setDebugInfo({
            isLoggedIn: false,
            userId: "",
            userRole: "",
          });
        }
      }
    );

    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            const role = data?.role || "unknown";
            setDebugInfo({
              isLoggedIn: true,
              userId: session.user.id,
              userRole: role,
            });
          });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="bg-yellow-100 p-2 text-xs font-mono border-b border-yellow-300">
      <div>
        Login: <strong>{debugInfo.isLoggedIn ? "Yes" : "No"}</strong> | 
        Role: <strong>{debugInfo.userRole || "N/A"}</strong> | 
        ID: <strong>{debugInfo.userId.slice(0, 8) || "N/A"}</strong>
      </div>
    </div>
  );
};

export default Debug;
