
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, LogOut, LayoutDashboard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMentorRoute = location.pathname.includes('/mentor/');
  const isMentoradoRoute = location.pathname.includes('/mentorado/');
  const isAdminRoute = location.pathname.includes('/admin/');
  
  // Hide navigation in mentor/mentorado/admin pages where sidebar is shown
  if (isMentorRoute || isMentoradoRoute || isAdminRoute) {
    return null;
  }

  // Check if user is logged in when component mounts
  useEffect(() => {
    const checkUserSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      setIsLoggedIn(!!session);
      
      if (session) {
        // Fetch user role from profiles table
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
    
    checkUserSession();
    
    // Set up listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoggedIn(!!session);
      
      if (session) {
        // Fetch user role from profiles table
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
          
        if (profileData) {
          setUserRole(profileData.role);
        }
      } else {
        setUserRole(null);
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

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

  const getDashboardLink = () => {
    switch(userRole) {
      case 'mentor':
        return '/mentor/dashboard';
      case 'mentorado':
        return '/mentorado/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  const handleDashboardClick = () => {
    const dashboardUrl = getDashboardLink();
    if (dashboardUrl !== '/') {
      navigate(dashboardUrl);
    }
  };

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="font-bold text-xl text-primary">
              MentorX
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/courses" className="text-gray-700 hover:text-primary">
              Cursos
            </Link>
            <Link to="/mentors" className="text-gray-700 hover:text-primary">
              Mentores
            </Link>
            <Link to="/schedule">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Agendar
              </Button>
            </Link>
            {isLoggedIn ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDashboardClick} 
                  className="flex items-center gap-1"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Acessar meu Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout} 
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button size="sm">Entrar</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
