
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const SidebarHeader = ({ isCollapsed, onToggleCollapse }: SidebarHeaderProps) => {
  return (
    <div className="p-4 flex items-center justify-between border-b">
      {!isCollapsed && (
        <h2 className="font-semibold text-lg">MentorX</h2>
      )}
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn("rounded-full", isCollapsed && "mx-auto")}
        onClick={onToggleCollapse}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default SidebarHeader;
