'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Edit, Trash2, CreditCard } from 'lucide-react';
import { type CardData, type SpendTracker } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import React, { useMemo } from 'react';
import { addMonths, addYears, startOfDay, addDays } from 'date-fns';

interface CardListItemProps {
  card: CardData;
  onEdit: () => void;
  onDelete: () => void;
}

// Helper to get the start of the next/previous period relative to a given start date
const getAdjacentPeriodStart = (currentPeriodStart: Date, type: SpendTracker['type'], direction: 'next' | 'prev'): Date => {
    const d = direction === 'next' ? 1 : -1;
    switch (type) {
        case 'Monthly': return addMonths(currentPeriodStart, d);
        case 'Quarterly': return addMonths(currentPeriodStart, d * 3);
        case 'Annual': return addYears(currentPeriodStart, d);
    }
};

// Helper to get the end of a period
const getPeriodEnd = (periodStart: Date, type: SpendTracker['type']): Date => {
    const nextPeriodStart = getAdjacentPeriodStart(periodStart, type, 'next');
    return addDays(nextPeriodStart, -1);
};


// Helper to get the start of the period that contains a given date, relative to the tracker's start date
const getPeriodStartForDate = (targetDate: Date, trackerStartDate: Date, type: SpendTracker['type']): Date => {
    let periodStart = startOfDay(new Date(trackerStartDate));
    const tDate = startOfDay(targetDate);

    if (tDate < periodStart) {
        // Target is before the tracker start. Iterate backwards.
        while (periodStart > tDate) {
            periodStart = getAdjacentPeriodStart(periodStart, type, 'prev');
        }
        return periodStart;
    } else {
        // Target is after the tracker start. Iterate forwards.
        let nextPeriodStart = getAdjacentPeriodStart(periodStart, type, 'next');
        while (tDate >= nextPeriodStart) {
            periodStart = nextPeriodStart;
            nextPeriodStart = getAdjacentPeriodStart(periodStart, type, 'next');
        }
        return periodStart;
    }
};


export function CardListItem({ card, onEdit, onDelete }: CardListItemProps) {
    const nextBill = card.bills.find(b => !b.paid);
    const mainTracker = card.spendTrackers[0];

    const currentSpend = useMemo(() => {
      if (!mainTracker) return 0;

      const trackerStartDate = new Date(mainTracker.startDate);
      const currentPeriodStart = getPeriodStartForDate(new Date(), trackerStartDate, mainTracker.type);
      const currentPeriodEnd = getPeriodEnd(currentPeriodStart, mainTracker.type);

      return card.bills
          .filter(bill => {
              const billDueDate = startOfDay(new Date(bill.dueDate));
              return billDueDate >= currentPeriodStart && billDueDate <= currentPeriodEnd;
          })
          .reduce((sum, bill) => sum + bill.amount, 0);
    }, [mainTracker, card.bills]);

    const progressValue = mainTracker && mainTracker.targetAmount > 0 ? (currentSpend / mainTracker.targetAmount) * 100 : 0;


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
             <AlertDialog>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={onEdit}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem 
                                onSelect={(e) => e.preventDefault()} 
                                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                    </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        card and all associated data.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
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
                            ${currentSpend.toLocaleString()} / ${mainTracker.targetAmount.toLocaleString()}
                        </span>
                    </div>
                    <Progress value={progressValue} />
                </div>
            )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Badge variant="outline">Due Date: {card.dueDate}th</Badge>
        <Button asChild variant="secondary" size="sm">
          <Link href={`/cards/${card.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
