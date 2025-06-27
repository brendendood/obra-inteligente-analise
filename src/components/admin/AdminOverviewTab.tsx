
import React from 'react';
import AdminStatusCard from './AdminStatusCard';
import AdminRecentActivity from './AdminRecentActivity';
import AdminQuickStats from './AdminQuickStats';

const AdminOverviewTab = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <AdminStatusCard />
      <AdminRecentActivity />
      <AdminQuickStats />
    </div>
  );
};

export default AdminOverviewTab;
