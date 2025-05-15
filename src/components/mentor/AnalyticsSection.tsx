
import EnrollmentChart from '@/components/EnrollmentChart';
import RecentModules from '@/components/RecentModules';

const AnalyticsSection = () => {
  return (
    <div className="mb-8 grid gap-6 md:grid-cols-4">
      <EnrollmentChart />
      <RecentModules />
    </div>
  );
};

export default AnalyticsSection;
