'use client';

import { useEffect, useState } from 'react';
import { useCards } from '@/contexts/card-context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign, CreditCard, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useSettings } from '@/contexts/settings-context';
import { Skeleton } from '@/components/ui/skeleton';

interface Stats {
    totalOutstanding: number;
    upcomingBillsCount: number;
    cardsDueSoon: number;
    totalPaidThisMonth: number;
}

export function StatsCards() {
  const { cards, loading } = useCards();
  const { currency } = useSettings();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (loading) return; // Wait for cards to be loaded

    const now = new Date();
    const allBills = cards.flatMap(card => card.bills);

    const upcomingPositiveBills = allBills.filter(bill => !bill.paid && new Date(bill.dueDate) >= now && bill.amount > 0);
    
    const totalOutstanding = allBills
      .filter(bill => !bill.paid && bill.amount > 0)
      .reduce((sum, bill) => sum + bill.amount, 0);

    const totalPaidThisMonth = allBills
      .filter(bill => {
        if (!bill.paid || !bill.paymentDate || bill.amount <= 0) return false;
        const paymentDate = new Date(bill.paymentDate);
        return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, bill) => sum + bill.amount, 0);

    const cardsDueSoon = upcomingPositiveBills
      .filter(bill => {
          const dueDate = new Date(bill.dueDate);
          const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
          return diffDays <= 7 && diffDays >= 0;
      }).length;
      
    setStats({
        totalOutstanding,
        upcomingBillsCount: upcomingPositiveBills.length,
        cardsDueSoon,
        totalPaidThisMonth,
    });

  }, [cards, loading]);

  if (!stats) {
      return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card><CardHeader><Skeleton className="h-5 w-3/4" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /></CardContent></Card>
              <Card><CardHeader><Skeleton className="h-5 w-3/4" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /></CardContent></Card>
              <Card><CardHeader><Skeleton className="h-5 w-3/4" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /></CardContent></Card>
              <Card><CardHeader><Skeleton className="h-5 w-3/4" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /></CardContent></Card>
          </div>
      );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currency}{stats.totalOutstanding.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
          <p className="text-xs text-muted-foreground">Across all cards</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Payments</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.upcomingBillsCount}</div>
          <p className="text-xs text-muted-foreground">Total bills to be paid</p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Payments Due Soon</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.cardsDueSoon}</div>
          <p className="text-xs text-muted-foreground">Bills due within 7 days</p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Paid This Month</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currency}{stats.totalPaidThisMonth.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
          <p className="text-xs text-muted-foreground">Total amount settled</p>
        </CardContent>
      </Card>
    </div>
  );
}
