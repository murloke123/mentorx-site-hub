
import { Users, BookOpen, DollarSign } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import { formatCurrency } from '@/utils/formatters';

interface StatsSectionProps {
  followersCount: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
}

const StatsSection = ({ followersCount, totalCourses, totalEnrollments, totalRevenue }: StatsSectionProps) => {
  return (
    <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard 
        title="Followers" 
        value={followersCount}
        icon={<Users />} 
        description="People who follow your profile" 
      />
      <StatsCard 
        title="Courses" 
        value={totalCourses} 
        icon={<BookOpen />} 
        description="Total courses created" 
      />
      <StatsCard 
        title="Total Enrollments" 
        value={totalEnrollments} 
        icon={<Users />} 
        description="Students across all courses" 
      />
      <StatsCard 
        title="Estimated Revenue" 
        value={formatCurrency(totalRevenue)} 
        icon={<DollarSign />} 
        description="From paid courses" 
      />
    </div>
  );
};

export default StatsSection;
