
import { PaymentsHeader } from './payments/PaymentsHeader';
import { PaymentsStats } from './payments/PaymentsStats';
import { PaymentsFilters } from './payments/PaymentsFilters';
import { PaymentsTable } from './payments/PaymentsTable';
import { useAdminPayments } from '@/hooks/useAdminPayments';

export const AdminPayments = () => {
  const {
    payments,
    stats,
    loading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    dateRange,
    setDateRange,
    exportPayments,
    clearFilters
  } = useAdminPayments();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PaymentsHeader onExport={exportPayments} />
      
      {stats && <PaymentsStats stats={stats} />}

      <PaymentsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onClearFilters={clearFilters}
      />

      <PaymentsTable payments={payments} />
    </div>
  );
};
