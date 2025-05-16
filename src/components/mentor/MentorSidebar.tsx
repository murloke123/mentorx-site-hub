
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Users, Calendar, Settings, ArrowLeft, ChevronRight, ChevronLeft, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const MentorSidebar = () => {
  const location = useLocation();
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
  ];

  return (
    <div 
      className={cn(
        "border-r h-screen sticky top-0 bg-white transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className={cn("p-4", isCollapsed && "items-center")}>
          <Link to="/" className={cn("flex items-center mb-6", isCollapsed && "justify-center")}>
            {isCollapsed ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ArrowLeft className="w-5 h-5" />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Voltar para o site
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="font-medium">Voltar para o site</span>
              </>
            )}
          </Link>
          
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
        
        <div className="mt-auto p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-center"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
            {!isCollapsed && <span className="ml-2">Recolher</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MentorSidebar;
