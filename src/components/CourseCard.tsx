import React from 'react';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Course {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  price?: number;
  discounted_price?: number;
  discount?: number;
  is_paid: boolean;
}

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const renderPrice = () => {
    if (!course.is_paid) {
      return <span className="text-2xl font-bold text-green-600">Gratuito</span>;
    }

    if (course.discounted_price && course.price) {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-green-600">
            R$ {course.discounted_price.toFixed(2)}
          </span>
          <span className="text-lg text-gray-500 line-through">
            R$ {course.price.toFixed(2)}
          </span>
        </div>
      );
    }

    return (
      <span className="text-2xl font-bold text-green-600">
        R$ {course.price?.toFixed(2) || '0.00'}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
      <div className="relative">
        {course.image_url ? (
          <img 
            src={course.image_url} 
            alt={course.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
            <GraduationCap className="h-16 w-16 text-purple-400" />
          </div>
        )}
        
        {course.discount != null && course.discount > 0 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
            -{course.discount}%
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-800">{course.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {course.description || "Descrição não disponível"}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          {renderPrice()}
        </div>
        
        <Button className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg">
          Eu quero!
        </Button>
      </div>
    </div>
  );
};

export default CourseCard;
