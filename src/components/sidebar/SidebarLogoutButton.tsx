
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarLogoutButtonProps {
  isCollapsed: boolean;
  onLogout: () => void;
}

const SidebarLogoutButton = ({ isCollapsed, onLogout }: SidebarLogoutButtonProps) => {
  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-center text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={onLogout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            Sair
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button
      variant="ghost"
      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
      onClick={onLogout}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sair
    </Button>
  );
};

export default SidebarLogoutButton;
