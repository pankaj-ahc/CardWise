'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCards } from '@/contexts/card-context';
import { CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, differenceInDays, parseISO } from 'date-fns';
import { useSettings } from '@/contexts/settings-context';
import { getBankLogo } from '@/lib/banks';
import { cn } from '@/lib/utils';

export function UpcomingBills() {
  const { cards } = useCards();
  const { currency } = useSettings();
  const now = new Date();
  const upcomingBills = cards.flatMap(card => 
    card.bills
      .filter(bill => !bill.paid)
      .map(bill => ({ ...bill, cardName: card.cardName, last4Digits: card.last4Digits, color: card.color, bankName: card.bankName }))
  )
  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  .slice(0, 5);

  const getUrgencyBadge = (dueDateStr: string) => {
    const dueDate = new Date(dueDateStr);
    const daysUntilDue = differenceInDays(dueDate, now);

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

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Upcoming Bills</CardTitle>
        <CardDescription>Your next 5 outstanding bills. Pay them on time!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingBills.map((bill) => {
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
                <p className="text-sm font-medium leading-none">{bill.cardName} ending in {bill.last4Digits}</p>
                <p className="text-sm text-muted-foreground">
                  Due on {format(new Date(bill.dueDate), 'MMM dd, yyyy')}
                </p>
              </div>
              <div className="ml-auto text-right">
                 <div className="font-medium">{currency}{bill.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                {getUrgencyBadge(bill.dueDate)}
              </div>
            </div>
          )})}
           {upcomingBills.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
                <p>No upcoming bills. You're all caught up!</p>
            </div>
           )}
        </div>
      </CardContent>
    </Card>
  );
}
