
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Course } from "@/types";

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Card className="h-full flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <div className="aspect-video w-full overflow-hidden bg-gray-100">
        <img 
          src={course.imageUrl || "/placeholder.svg"} 
          alt={course.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{course.title}</CardTitle>
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
