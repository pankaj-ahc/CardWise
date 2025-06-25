
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Edit, Trash2, CreditCard } from 'lucide-react';
import { type CardData, type SpendTracker, type Bill } from '@/lib/types';
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
import React, { useState, useEffect } from 'react';
import { addMonths, addYears, startOfDay, addDays, format } from 'date-fns';
import { useSettings } from '@/contexts/settings-context';
import { getBankLogo } from '@/lib/banks';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

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


const TrackerProgress = ({ tracker, bills }: { tracker: SpendTracker, bills: Bill[] }) => {
    const { currency } = useSettings();
    const [progress, setProgress] = useState<{currentSpend: number, progressValue: number} | null>(null);

    useEffect(() => {
        const trackerStartDate = new Date(tracker.startDate);
        const currentPeriodStart = getPeriodStartForDate(new Date(), trackerStartDate, tracker.type);
        const currentPeriodEnd = getPeriodEnd(currentPeriodStart, tracker.type);
        
        const currentSpend = bills
            .filter(bill => {
                const billDueDate = startOfDay(new Date(bill.dueDate));
                return billDueDate >= currentPeriodStart && billDueDate <= currentPeriodEnd;
            })
            .reduce((sum, bill) => sum + bill.amount, 0);

        const progressValue = tracker.targetAmount > 0 ? (currentSpend / tracker.targetAmount) * 100 : 0;
        setProgress({ currentSpend, progressValue });
    }, [tracker, bills]);
    
    if (!progress) {
        return (
             <div className="space-y-2">
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-5 w-full" />
            </div>
        );
    }
    
    const isCompleted = progress.progressValue >= 100;
    
    return (
        <div key={tracker.id}>
            <p className="text-xs font-medium text-muted-foreground mb-1 truncate">{tracker.name}</p>
            <div className="relative">
                <Progress value={progress.progressValue} className={cn("h-5", isCompleted && "[&>div]:bg-green-500")} />
                {!isCompleted && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-primary-foreground px-1 truncate">
                            {currency}{progress.currentSpend.toLocaleString('en-US', { maximumFractionDigits: 0 })} / {currency}{tracker.targetAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}


export function CardListItem({ card, onEdit, onDelete }: CardListItemProps) {
    const { currency } = useSettings();
    const nextBill = card.bills.find(b => !b.paid);
    const bankLogo = getBankLogo(card.bankName);

  return (
    <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
            <div 
              className={cn("w-12 h-12 rounded-lg flex items-center justify-center", bankLogo ? "bg-card" : "")}
              style={!bankLogo ? { backgroundColor: card.color } : {}}
            >
                {bankLogo ? (
                     <img src={bankLogo} alt={`${card.bankName} logo`} width="32" height="32" style={{ objectFit: 'contain' }} className="w-8 h-8" />
                ) : (
                    <CreditCard className="w-8 h-8 text-white"/>
                )}
            </div>
            <div className="flex-grow min-w-0">
                <CardTitle className="font-headline">{`${card.cardName} (${card.bankName})`}</CardTitle>
                <CardDescription>{card.last4Digits && `•••• ${card.last4Digits.slice(-4)}`}</CardDescription>
                {card.perks && card.perks.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {card.perks.map(perk => (
                            <Badge key={perk} variant="secondary" className="px-1.5 py-px text-[10px] font-normal">{perk}</Badge>
                        ))}
                    </div>
                )}
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
                        <span className="text-lg font-bold">{currency}{nextBill.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <p className="text-right text-sm text-muted-foreground">Due on {format(new Date(nextBill.dueDate), 'MMM dd, yyyy')}</p>
                </div>
            ) : (
                <div className="text-center py-4 text-sm text-muted-foreground">No upcoming bills</div>
            )}

            {card.spendTrackers.length > 0 && (
                <div className="border-t pt-4 space-y-4">
                    {card.spendTrackers.map((tracker) => (
                        <TrackerProgress key={tracker.id} tracker={tracker} bills={card.bills} />
                    ))}
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
