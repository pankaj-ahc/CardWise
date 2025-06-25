'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCards } from '@/contexts/card-context';
import { CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, differenceInDays } from 'date-fns';
import { useSettings } from '@/contexts/settings-context';
import { getBankAbbreviation, getBankLogo } from '@/lib/banks';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export function UpcomingBills() {
  const { cards, loading } = useCards();
  const { currency } = useSettings();
  const [upcomingBills, setUpcomingBills] = useState<any[] | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Set the current date on the client side
    setNow(new Date());
  }, []);

  useEffect(() => {
    if (loading || !now) return;

    const sortedBills = cards.flatMap(card => 
      card.bills
        .filter(bill => !bill.paid && bill.amount > 0)
        .map(bill => ({ ...bill, cardName: card.cardName, last4Digits: card.last4Digits, color: card.color, bankName: card.bankName }))
    )
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    setUpcomingBills(sortedBills);

  }, [cards, loading, now]);


  const getUrgencyBadge = (dueDateStr: string, currentDate: Date) => {
    const dueDate = new Date(dueDateStr);
    const daysUntilDue = differenceInDays(dueDate, currentDate);

    if (daysUntilDue < 0) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    if (daysUntilDue <= 7) {
      return <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600">Due Soon</Badge>;
    }
    if (daysUntilDue <= 15) {
      return <Badge variant="secondary">Upcoming</Badge>;
    }
    return null;
  };
  
  const renderContent = () => {
    if (upcomingBills === null) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      );
    }

    if (upcomingBills.length > 0 && now) {
      return upcomingBills.map((bill) => {
        const bankLogo = getBankLogo(bill.bankName);
        return (
          <div key={bill.id} className="flex items-center">
             <div className={cn("rounded-lg mr-4 flex items-center justify-center w-10 h-10", bankLogo ? "bg-card" : "")} style={!bankLogo ? { backgroundColor: bill.color } : {}}>
              {bankLogo ? (
                  <img src={bankLogo} alt={`${bill.bankName} logo`} width="32" height="32" style={{ objectFit: 'contain' }} className="w-8 h-8" />
              ) : (
                  <CreditCard className="h-6 w-6 text-white" />
              )}
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium leading-none">{`${bill.cardName} (${getBankAbbreviation(bill.bankName)})`} {bill.last4Digits && `ending in ${bill.last4Digits.slice(-4)}`}</p>
              <p className="text-sm text-muted-foreground">
                Due on {format(new Date(bill.dueDate), 'MMM dd, yyyy')}
              </p>
            </div>
            <div className="ml-auto text-right">
               <div className="font-medium">{currency}{bill.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
              {getUrgencyBadge(bill.dueDate, now)}
            </div>
          </div>
        )
      });
    }

    return (
      <div className="text-center text-muted-foreground py-8">
          <p>No upcoming bills. You're all caught up!</p>
      </div>
    );
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Upcoming Bills</CardTitle>
        <CardDescription>All your outstanding bills. Pay them on time!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
           {renderContent()}
        </div>
      </CardContent>
    </Card>
  );
}
