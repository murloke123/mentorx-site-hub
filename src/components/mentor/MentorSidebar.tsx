
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Users, BarChart, Settings, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const MentorSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: "Dashboard",
      icon: BarChart,
      href: "/mentor/dashboard",
    },
    {
      title: "Cursos",
      icon: BookOpen,
      href: "/courses",
    },
    {
      title: "Seguidores",
      icon: Users,
      href: "/mentor/followers",
    },
    {
      title: "Configurações",
      icon: Settings,
      href: "/mentor/settings",
    },
  ];

  return (
    <div className="w-64 border-r h-screen sticky top-0 bg-white">
      <div className="p-4">
        <Link to="/" className="flex items-center space-x-2 mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Voltar para o site</span>
        </Link>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link key={item.href} to={item.href}>
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
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MentorSidebar;
