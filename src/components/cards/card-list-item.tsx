'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Edit, Trash2, CreditCard } from 'lucide-react';
import { type CardData } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

interface CardListItemProps {
  card: CardData;
}

export function CardListItem({ card }: CardListItemProps) {
    const nextBill = card.bills.find(b => !b.paid);
    const mainTracker = card.spendTrackers[0];

  return (
    <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
            <div className="p-3 rounded-lg" style={{ backgroundColor: card.color }}>
                <CreditCard className="w-6 h-6 text-white"/>
            </div>
            <div className="flex-grow">
                <CardTitle className="font-headline">{card.cardName}</CardTitle>
                <CardDescription>{card.bankName} •••• {card.last4Digits}</CardDescription>
            </div>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
            {nextBill ? (
                 <div>
                    <div className="mb-1 flex justify-between items-baseline">
                        <span className="text-sm font-medium text-muted-foreground">Next Bill</span>
                        <span className="text-lg font-bold">${nextBill.amount.toLocaleString()}</span>
                    </div>
                    <p className="text-right text-sm text-muted-foreground">Due on {nextBill.dueDate.split('T')[0]}</p>
                </div>
            ) : (
                <div className="text-center py-4 text-sm text-muted-foreground">No upcoming bills</div>
            )}

            {mainTracker && (
                <div>
                    <div className="mb-1 flex justify-between items-baseline">
                        <span className="text-sm font-medium text-muted-foreground">{mainTracker.name}</span>
                        <span className="text-sm font-semibold">
                            ${mainTracker.currentSpend.toLocaleString()} / ${mainTracker.targetAmount.toLocaleString()}
                        </span>
                    </div>
                    <Progress value={(mainTracker.currentSpend / mainTracker.targetAmount) * 100} />
                </div>
            )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Badge variant="outline">Bill Date: {card.billDate}th</Badge>
        <Button asChild variant="secondary" size="sm">
          <Link href={`/cards/${card.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
