
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, Book } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

const Navigation = () => {
  // Check if user is logged in
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
  });

  // Check if user is a mentor
  const { data: profile } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      return data;
    },
    enabled: !!user,
  });

  const isMentor = profile?.role === 'mentor';

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
              <span className="flex items-center gap-1">
                <Book className="h-4 w-4" />
                Courses
              </span>
            </Link>
            <Link to="/mentors" className="text-gray-700 hover:text-primary">
              Mentors
            </Link>
            <Link to="/schedule">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Schedule
              </Button>
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-2">
                {isMentor && (
                  <Link to="/mentor/dashboard">
                    <Button size="sm" variant="outline">
                      Mentor Dashboard
                    </Button>
                  </Link>
                )}
                <Link to="/account">
                  <Button size="sm">
                    My Account
                  </Button>
                </Link>
              </div>
            ) : (
              <Link to="/login">
                <Button size="sm">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
