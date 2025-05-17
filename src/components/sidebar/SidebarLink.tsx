
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  title: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const SidebarLink = ({ href, icon: Icon, title, isActive, isCollapsed }: SidebarLinkProps) => {
  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-center", 
                isActive ? "bg-muted" : ""
              )}
              asChild
            >
              <Link to={href}>
                <Icon className="h-5 w-5" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {title}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start", 
        isActive ? "bg-muted" : ""
      )}
      asChild
    >
      <Link to={href}>
        <Icon className="mr-2 h-4 w-4" />
        {title}
      </Link>
    </Button>
  );
};

export default SidebarLink;
