
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare } from "lucide-react";

const Navigation = () => {
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
            <Link to="/login">
              <Button size="sm">Entrar</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
