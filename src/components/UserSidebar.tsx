
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSidebarNavigation } from "@/hooks/useSidebarNavigation";
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarNavigation from "./sidebar/SidebarNavigation";
import SidebarLogoutButton from "./sidebar/SidebarLogoutButton";

const UserSidebar = () => {
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const getUserRole = async () => {
      try {
        console.log("UserSidebar: Fetching user role");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("UserSidebar: Session found, fetching profile");
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error("UserSidebar: Error fetching profile:", error);
            throw error;
          }
            
          if (profileData) {
            console.log("UserSidebar: Setting user role to", profileData.role);
            setUserRole(profileData.role);
          } else {
            console.log("UserSidebar: No profile data found");
          }
        } else {
          console.log("UserSidebar: No session found");
        }
      } catch (error) {
        console.error("UserSidebar: Error in getUserRole:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getUserRole();
  }, []);
  
  const menuItems = useSidebarNavigation(userRole);

  const handleLogout = async () => {
    try {
      console.log("UserSidebar: Starting logout process");
      
      // Clean up authentication state
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          console.log("UserSidebar: Removing localStorage key:", key);
          localStorage.removeItem(key);
        }
      });
      
      // Also clean up from sessionStorage if needed
      Object.keys(sessionStorage || {}).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          console.log("UserSidebar: Removing sessionStorage key:", key);
          sessionStorage.removeItem(key);
        }
      });
      
      await supabase.auth.signOut({ scope: 'global' });
      console.log("UserSidebar: Logout API call completed");
      
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado da sua conta"
      });
      
      // Force a page refresh to clear all state
      window.location.href = "/";
    } catch (error) {
      console.error("UserSidebar: Erro ao fazer logout:", error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: "Ocorreu um problema ao tentar desconectar sua conta"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="border-r h-screen sticky top-0 bg-white w-64 flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "border-r h-screen sticky top-0 bg-white transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <SidebarHeader 
          isCollapsed={isCollapsed} 
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)} 
        />
        
        <SidebarNavigation 
          menuItems={menuItems} 
          isCollapsed={isCollapsed} 
        />
        
        <div className="mt-auto p-4 border-t">
          <SidebarLogoutButton 
            isCollapsed={isCollapsed} 
            onLogout={handleLogout} 
          />
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;
