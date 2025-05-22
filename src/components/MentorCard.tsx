import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { type Mentor } from "@/services/mentorService";

interface MentorCardProps {
  mentor: Mentor;
}

const MentorCard: React.FC<MentorCardProps> = ({ mentor }) => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center gap-4">
          {mentor.avatar_url ? (
            <img
              src={mentor.avatar_url}
              alt={mentor.full_name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold">{mentor.full_name}</h3>
            <p className="text-sm text-gray-500">{mentor.courses_count} cursos</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-gray-600 line-clamp-3">
          {mentor.bio || "Este mentor ainda não adicionou uma biografia."}
        </p>
      </CardContent>
      
      <CardFooter>
        <Link to={`/mentors/${mentor.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            Ver perfil
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default MentorCard;
