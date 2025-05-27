
import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import TestDashboard from '@/components/admin/tests/TestDashboard';

const AdminTestsPage = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <TestDashboard />
      </div>
    </div>
  );
};

export default AdminTestsPage;
