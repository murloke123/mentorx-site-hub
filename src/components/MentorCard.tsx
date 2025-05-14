
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { User } from "@/types";

interface MentorCardProps {
  mentor: User;
}

const MentorCard = ({ mentor }: MentorCardProps) => {
  return (
    <Card className="h-full flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="flex justify-center">
        <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-gray-200">
          <img 
            src={mentor.profileImage || "/placeholder.svg"} 
            alt={mentor.name} 
            className="w-full h-full object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="text-center flex-grow pb-2">
        <h3 className="text-lg font-medium mb-1">{mentor.name}</h3>
        {mentor.areas && mentor.areas.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1 mb-3">
            {mentor.areas.map((area, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                {area}
              </span>
            ))}
          </div>
        )}
        <p className="text-sm text-gray-600 line-clamp-3">{mentor.bio}</p>
      </CardContent>
      <CardFooter className="pt-2 flex gap-2 justify-center">
        <Link to={`/mentors/${mentor.id}`}>
          <Button variant="outline" size="sm">Ver Perfil</Button>
        </Link>
        <Link to={`/schedule/${mentor.id}`}>
          <Button size="sm" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Agendar
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default MentorCard;
