
import { 
  Users, 
  Calendar, 
  Settings, 
  LayoutDashboard, 
  BookOpen, 
  Home 
} from "lucide-react";

type MenuItem = {
  title: string;
  icon: any;
  href: string;
};

export function useSidebarNavigation(userRole: string | null) {
  const baseItems: MenuItem[] = [
    {
      title: "Home",
      icon: Home,
      href: "/",
    }
  ];
  
  const mentorItems: MenuItem[] = [
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
    }
  ];
  
  const mentoradoItems: MenuItem[] = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/mentorado/dashboard",
    },
    {
      title: "Meus Cursos",
      icon: BookOpen,
      href: "/mentorado/cursos",
    },
    {
      title: "Mentores",
      icon: Users,
      href: "/mentorado/mentores",
    },
    {
      title: "Calendário",
      icon: Calendar,
      href: "/mentorado/calendario",
    },
    {
      title: "Configurações",
      icon: Settings,
      href: "/mentorado/configuracoes",
    }
  ];
  
  const adminItems: MenuItem[] = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
    },
    {
      title: "Cursos",
      icon: BookOpen,
      href: "/admin/cursos",
    },
    {
      title: "Mentores",
      icon: Users,
      href: "/admin/mentores",
    },
    {
      title: "Mentorados",
      icon: Users,
      href: "/admin/mentorados",
    },
    {
      title: "Calendário",
      icon: Calendar,
      href: "/admin/calendario",
    },
    {
      title: "Configurações",
      icon: Settings,
      href: "/admin/configuracoes",
    }
  ];

  switch (userRole) {
    case 'mentor':
      return [...baseItems, ...mentorItems];
    case 'mentorado':
      return [...baseItems, ...mentoradoItems];
    case 'admin':
      return [...baseItems, ...adminItems];
    default:
      return baseItems;
  }
}
