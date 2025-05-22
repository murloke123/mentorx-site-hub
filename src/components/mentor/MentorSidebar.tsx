
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Users, Calendar, Settings, ChevronRight, ChevronLeft, LayoutDashboard, LogOut, BookOpen, GitMerge, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MentorSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/mentor/dashboard",
    },
    {
      title: "Meus Cursos",
      icon: BookOpen,
      href: "/mentor/cursos",
    },
    {
      title: "Meus Mentorados",
      icon: Users,
      href: "/mentor/mentorados",
    },
    {
      title: "Calendário",
      icon: Calendar,
      href: "/mentor/calendario",
    },
    {
      title: "Configurações",
      icon: Settings,
      href: "/mentor/configuracoes",
    },
    {
      title: "Rotas",
      icon: GitMerge,
      href: "/mentor/configuracoes/rotas",
    },
    {
      title: "Mapeamento DB",
      icon: Database,
      href: "/mentor/configuracoes/database-mapping",
    },
  ];

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

  return (
    <div 
      className={cn(
        "border-r h-screen sticky top-0 bg-white transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Cabeçalho com nome e botão de recolher */}
        <div className="p-4 flex items-center justify-between border-b">
          {!isCollapsed && (
            <h2 className="font-semibold text-lg">MentorX</h2>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("rounded-full", isCollapsed && "mx-auto")}
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
          
        <div className={cn("p-4", isCollapsed && "items-center")}>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link key={item.href} to={item.href}>
                {isCollapsed ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-center", 
                            location.pathname === item.href ? "bg-muted" : ""
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start", 
                      location.pathname === item.href ? "bg-muted" : ""
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Button>
                )}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-4 border-t">
          {/* Logout button */}
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-center text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Sair
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorSidebar;
