
import { useLocation } from "react-router-dom";
import SidebarLink from "./SidebarLink";
import { cn } from "@/lib/utils";

interface SidebarNavigationProps {
  menuItems: Array<{
    title: string;
    icon: any;
    href: string;
  }>;
  isCollapsed: boolean;
}

const SidebarNavigation = ({ menuItems, isCollapsed }: SidebarNavigationProps) => {
  const location = useLocation();

  return (
    <div className={cn("p-4", isCollapsed && "items-center")}>
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <SidebarLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            title={item.title}
            isActive={location.pathname === item.href}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>
    </div>
  );
};

export default SidebarNavigation;
