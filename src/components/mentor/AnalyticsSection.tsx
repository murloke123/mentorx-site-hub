import EnrollmentChart from '@/components/EnrollmentChart';
// import RecentModules from '@/components/RecentModules'; // Removido

const AnalyticsSection = () => {
  return (
    <div className="mb-8 grid gap-6 md:grid-cols-4">
      {/* O EnrollmentChart agora pode ocupar mais colunas se desejado, ex: md:col-span-4 */}
      <div className="md:col-span-4">
        <EnrollmentChart />
      </div>
      {/* <RecentModules /> // Removido */}
    </div>
  );
};

export default AnalyticsSection;
