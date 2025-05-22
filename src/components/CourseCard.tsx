
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Course } from "@/types";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { BookOpen } from "lucide-react";

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  // Calculate if there's a discount
  const hasDiscount = course.discount && course.discount > 0 && course.price && course.price > 0;

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <AspectRatio ratio={16 / 9}>
        {course.image_url ? (
          <img 
            src={course.image_url} 
            alt={course.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </AspectRatio>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{course.title}</CardTitle>
        {course.mentor_name && (
          <div className="flex items-center space-x-2 mt-1">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-3 w-3 text-primary" />
            </div>
            <span className="text-sm text-gray-600">{course.mentor_name}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <p className="text-sm text-gray-600 line-clamp-3">{course.description}</p>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between items-center">
        <div>
          {course.is_paid ? (
            hasDiscount ? (
              <div className="flex flex-col">
                <span className="line-through text-red-500 text-sm">
                  R$ {course.price?.toFixed(2)}
                </span>
                <span className="text-green-600 font-semibold">
                  R$ {course.discounted_price?.toFixed(2)}
                  <span className="ml-1 text-xs bg-green-100 text-green-800 px-1 rounded">
                    -{course.discount}%
                  </span>
                </span>
              </div>
            ) : (
              <span className="font-semibold">R$ {course.price?.toFixed(2)}</span>
            )
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
