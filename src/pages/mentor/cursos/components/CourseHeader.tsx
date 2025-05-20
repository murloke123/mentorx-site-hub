
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface CourseHeaderProps {
  title: string;
  progress: number;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ title, progress }) => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      <div className="flex items-center">
        <span className="text-sm mr-2">{Math.round(progress)}% concluído</span>
        <Progress value={progress} className="w-32 h-2 bg-gray-700 [&>*]:bg-green-500" />
      </div>
    </header>
  );
};

export default CourseHeader;
