import { StatsCards } from '@/components/dashboard/stats-cards';
import { ExpenseChart } from '@/components/dashboard/expense-chart';
import { UpcomingBills } from '@/components/dashboard/upcoming-bills';

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h2>
      </div>
      <div className="space-y-4">
        <StatsCards />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <ExpenseChart />
            <UpcomingBills />
        </div>
      </div>
    </div>
  );
}
