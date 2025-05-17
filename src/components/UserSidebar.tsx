
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
  
  useEffect(() => {
    const getUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
          
        if (profileData) {
          setUserRole(profileData.role);
        }
      }
    };
    
    getUserRole();
  }, []);
  
  const menuItems = useSidebarNavigation(userRole);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado da sua conta"
      });
      // Force a page refresh to clear all state
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: "Ocorreu um problema ao tentar desconectar sua conta"
      });
    }
  };

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
