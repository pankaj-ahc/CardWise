import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DUMMY_CARDS } from '@/lib/data';
import { CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, differenceInDays, parse } from 'date-fns';

export function UpcomingBills() {
  const now = new Date();
  const upcomingBills = DUMMY_CARDS.flatMap(card => 
    card.bills
      .filter(bill => !bill.paid)
      .map(bill => ({ ...bill, cardName: card.cardName, last4Digits: card.last4Digits, color: card.color }))
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
          {upcomingBills.map((bill) => (
            <div key={bill.id} className="flex items-center">
              <div className="p-3 rounded-lg mr-4" style={{ backgroundColor: bill.color }}>
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div className="flex-grow">
                <p className="text-sm font-medium leading-none">{bill.cardName} ending in {bill.last4Digits}</p>
                <p className="text-sm text-muted-foreground">
                  Due on {format(new Date(bill.dueDate), 'MMM dd, yyyy')}
                </p>
              </div>
              <div className="ml-auto text-right">
                 <div className="font-medium">${bill.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                {getUrgencyBadge(bill.dueDate)}
              </div>
            </div>
          ))}
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
