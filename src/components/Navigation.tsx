import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, User, LayoutDashboard, Settings, LogOut, UserCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { NotificationBell } from "@/components/NotificationBell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    console.info("Navigation: Checking user session");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.info("Navigation: Auth state changed:", event);
        setSession(session);
        
        if (session?.user.id) {
          // Buscar role e perfil completo do usuário
          supabase
            .from("profiles")
            .select("role, full_name, avatar_url")
            .eq("id", session.user.id)
            .single()
            .then(({ data, error }) => {
              if (error) {
                console.error("Error fetching user profile:", error);
                return;
              }
              
              console.info("Navigation: User profile:", data);
              setUserRole(data?.role || null);
              setUserProfile(data);
              
              // Auto-redirect admin users to admin dashboard after login
              if (event === 'SIGNED_IN' && data?.role === 'admin') {
                navigate('/admin/dashboard');
              }
            });
        } else {
          setUserRole(null);
          setUserProfile(null);
        }
      }
    );
    
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user.id) {
        supabase
          .from("profiles")
          .select("role, full_name, avatar_url")
          .eq("id", session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error("Error fetching user profile:", error);
              return;
            }
            
            console.info("Navigation: Initial user profile:", data);
            setUserRole(data?.role || null);
            setUserProfile(data);
          });
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado da sua conta"
      });
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: "Ocorreu um problema ao tentar desconectar sua conta"
      });
    }
  };
  
  const getProfileRoute = () => {
    if (userRole === 'admin') {
      return '/admin/perfil';
    } else if (userRole === 'mentor') {
      return '/mentor/perfil';
    } else if (userRole === 'mentorado') {
      return '/mentorado/perfil';
    } else {
      return '/';
    }
  };

  const getConfigRoute = () => {
    if (userRole === 'admin') {
      return '/admin/configuracoes';
    } else if (userRole === 'mentor') {
      return '/mentor/configuracoes';
    } else if (userRole === 'mentorado') {
      return '/mentorado/configuracoes';
    } else {
      return '/';
    }
  };

  const handleDashboardAccess = () => {
    if (userRole === 'admin') {
      navigate('/admin/dashboard');
    } else if (userRole === 'mentor') {
      navigate('/mentor/dashboard');
    } else if (userRole === 'mentorado') {
      navigate('/mentorado/dashboard');
    } else {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você não tem permissão para acessar essa área"
      });
    }
  };

  const getUserInitials = () => {
    if (userProfile?.full_name) {
      return userProfile.full_name
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return session?.user?.email?.charAt(0).toUpperCase() || 'U';
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case 'admin':
        return 'Administrador';
      case 'mentor':
        return 'Mentor';
      case 'mentorado':
        return 'Mentorado';
      default:
        return 'Usuário';
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
            
            {session && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={handleDashboardAccess}
              >
                <LayoutDashboard className="h-4 w-4" />
                Meu Dashboard
              </Button>
            )}
            
            {/* Sininho de notificações - só para mentores */}
            {session && userRole === 'mentor' && (
              <NotificationBell mentorId={session.user.id} />
            )}
            
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full h-10 w-10 p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-sm font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-white z-50 shadow-lg border border-gray-200">
                  <DropdownMenuLabel className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white font-semibold">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {userProfile?.full_name || session?.user?.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          {getRoleLabel()}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  
                  <div className="py-1">
                  <Link to={getProfileRoute()}>
                      <DropdownMenuItem className="cursor-pointer px-4 py-2 hover:bg-gray-50">
                        <UserCircle className="h-4 w-4 mr-3 text-gray-500" />
                      Meu Perfil
                    </DropdownMenuItem>
                  </Link>
                    <DropdownMenuItem className="cursor-pointer px-4 py-2 hover:bg-gray-50" onClick={handleDashboardAccess}>
                      <LayoutDashboard className="h-4 w-4 mr-3 text-gray-500" />
                    Meu Dashboard
                  </DropdownMenuItem>
                    <Link to={getConfigRoute()}>
                      <DropdownMenuItem className="cursor-pointer px-4 py-2 hover:bg-gray-50">
                        <Settings className="h-4 w-4 mr-3 text-gray-500" />
                        Configurações
                      </DropdownMenuItem>
                    </Link>
                  </div>
                  
                  <DropdownMenuSeparator className="my-1" />
                  
                  <div className="py-1">
                    <DropdownMenuItem 
                      className="cursor-pointer px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700" 
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-3 text-red-500" />
                    Sair
                  </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
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
