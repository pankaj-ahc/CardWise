import { DUMMY_CARDS } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign, CreditCard, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { type Bill } from '@/lib/types';

export function StatsCards() {
  const now = new Date();
  const upcomingBills = DUMMY_CARDS.flatMap(card => card.bills)
    .filter(bill => !bill.paid && new Date(bill.dueDate) >= now);

  const totalOutstanding = DUMMY_CARDS.flatMap(card => card.bills)
    .filter(bill => !bill.paid)
    .reduce((sum, bill) => sum + bill.amount, 0);

  const totalPaidThisMonth = DUMMY_CARDS.flatMap(card => card.bills)
    .filter(bill => {
      if (!bill.paid || !bill.paymentDate) return false;
      const paymentDate = new Date(bill.paymentDate);
      return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, bill) => sum + bill.amount, 0);


  const cardsDueSoon = upcomingBills
    .filter(bill => {
        const dueDate = new Date(bill.dueDate);
        const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
        return diffDays <= 7 && diffDays >= 0;
    }).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <p className="text-xs text-muted-foreground">Across all cards</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Payments</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingBills.length}</div>
          <p className="text-xs text-muted-foreground">Total bills to be paid</p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Payments Due Soon</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cardsDueSoon}</div>
          <p className="text-xs text-muted-foreground">Bills due within 7 days</p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Paid This Month</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalPaidThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <p className="text-xs text-muted-foreground">Total amount settled</p>
        </CardContent>
      </Card>
    </div>
  );
}
