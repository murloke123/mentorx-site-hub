
import React from 'react';
import { Button } from '@/components/ui/button';

interface CourseCardProps {
  title: string;
  price: string;
  originalPrice?: string;
  icon: string;
  description: string;
  badge?: string;
  badgeColor?: string;
}

const CourseCard = ({ title, price, originalPrice, icon, description, badge, badgeColor = 'bg-orange-500' }: CourseCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-105 relative">
      {badge && (
        <div className={`absolute top-4 right-4 ${badgeColor} text-white px-3 py-1 rounded-full text-xs font-bold z-10`}>
          {badge}
        </div>
      )}
      
      <div className="p-6">
        <div className="text-4xl mb-4 text-center">{icon}</div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{title}</h3>
        
        <p className="text-gray-600 text-sm mb-4 text-center">{description}</p>
        
        <div className="text-center mb-4">
          {originalPrice && (
            <span className="text-gray-400 line-through text-sm mr-2">{originalPrice}</span>
          )}
          <span className="text-2xl font-bold text-green-600">{price}</span>
        </div>
        
        <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-lg transition-all duration-300">
          Comprar Agora
        </Button>
      </div>
    </div>
  );
};

export default CourseCard;
