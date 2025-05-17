
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Calendar, 
  Settings,
  Home
} from "lucide-react";
import UserSidebar from "@/components/UserSidebar";

const MentorSidebar = () => {
  // Using the existing UserSidebar component which already handles the sidebar functionality
  return <UserSidebar />;
};

export default MentorSidebar;
