
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Course } from "@/types";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { mockMentors } from "@/data/mockData";

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const mentor = mockMentors.find(m => m.id === course.mentorId);

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <AspectRatio ratio={16 / 9}>
        <img 
          src={course.imageUrl || "/placeholder.svg"} 
          alt={course.title} 
          className="w-full h-full object-cover"
        />
      </AspectRatio>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{course.title}</CardTitle>
        {mentor && (
          <div className="flex items-center space-x-2 mt-1">
            <img 
              src={mentor.profileImage || "/placeholder.svg"} 
              alt={mentor.name} 
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm text-gray-600">{mentor.name}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <p className="text-sm text-gray-600 line-clamp-3">{course.description}</p>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between items-center">
        <div>
          {course.price > 0 ? (
            <span className="font-semibold">R$ {course.price.toFixed(2)}</span>
          ) : (
            <span className="text-green-600 font-semibold">Grátis</span>
          )}
        </div>
        <Link to={`/courses/${course.id}`}>
          <Button size="sm" variant="outline">Ver Detalhes</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
