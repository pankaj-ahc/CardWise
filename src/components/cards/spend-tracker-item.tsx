'use client';

import { useState, useMemo } from 'react';
import { type SpendTracker, type Bill } from '@/lib/types';
import { Button } from '@/components/ui/button';
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
} from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, addYears, subYears, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, getQuarter } from 'date-fns';

interface SpendTrackerItemProps {
    tracker: SpendTracker;
    bills: Bill[];
    onEdit: () => void;
    onDelete: () => void;
}

// Helper to get the start of the period containing a given date
const getPeriodStartForDate = (date: Date, type: SpendTracker['type']): Date => {
    switch (type) {
        case 'Monthly': return startOfMonth(date);
        case 'Quarterly': return startOfQuarter(date);
        case 'Annual': return startOfYear(date);
    }
};

// Helper to get the start of the next/previous period
const getAdjacentPeriodStart = (currentPeriodStart: Date, type: SpendTracker['type'], direction: 'next' | 'prev'): Date => {
    const d = direction === 'next' ? 1 : -1;
    switch (type) {
        case 'Monthly': return addMonths(currentPeriodStart, d);
        case 'Quarterly': return addMonths(currentPeriodStart, d * 3);
        case 'Annual': return addYears(currentPeriodStart, d);
    }
};

const getPeriodEnd = (periodStart: Date, type: SpendTracker['type']): Date => {
    switch (type) {
        case 'Monthly': return endOfMonth(periodStart);
        case 'Quarterly': return endOfQuarter(periodStart);
        case 'Annual': return endOfYear(periodStart);
    }
};

const getPeriodLabel = (periodStart: Date, type: SpendTracker['type']): string => {
    switch (type) {
        case 'Monthly': return format(periodStart, 'MMMM yyyy');
        case 'Quarterly': return `Q${getQuarter(periodStart)} ${format(periodStart, 'yyyy')}`;
        case 'Annual': return format(periodStart, 'yyyy');
    }
};


export function SpendTrackerItem({ tracker, bills, onEdit, onDelete }: SpendTrackerItemProps) {
    const initialPeriodStart = useMemo(() => getPeriodStartForDate(new Date(), tracker.type), [tracker.type]);
    const [viewedPeriodStart, setViewedPeriodStart] = useState<Date>(initialPeriodStart);

    const { periodEnd, periodLabel, currentSpend } = useMemo(() => {
        const end = getPeriodEnd(viewedPeriodStart, tracker.type);
        const spend = bills
            .filter(bill => {
                const billDueDate = new Date(bill.dueDate);
                return billDueDate >= viewedPeriodStart && billDueDate <= end;
            })
            .reduce((sum, bill) => sum + bill.amount, 0);
        
        const label = getPeriodLabel(viewedPeriodStart, tracker.type);

        return { periodEnd: end, periodLabel: label, currentSpend: spend };
    }, [viewedPeriodStart, tracker.type, bills]);

    const handlePrev = () => setViewedPeriodStart(getAdjacentPeriodStart(viewedPeriodStart, tracker.type, 'prev'));
    const handleNext = () => setViewedPeriodStart(getAdjacentPeriodStart(viewedPeriodStart, tracker.type, 'next'));

    const progressValue = tracker.targetAmount > 0 ? (currentSpend / tracker.targetAmount) * 100 : 0;

    return (
        <div className="group relative border-t pt-6">
            <div className="absolute top-2 right-0">
                <AlertDialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={onEdit}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem 
                                    onSelect={(e) => { e.preventDefault(); }}
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
                                This action cannot be undone. This will permanently delete this spend tracker.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <div className="flex justify-between items-center mb-2">
                <div>
                    <p className="font-medium">{tracker.name}</p>
                    <p className="text-sm text-muted-foreground">{tracker.type}</p>
                </div>
                <div className="flex items-center gap-2">
                     <Button variant="outline" size="icon" className="h-7 w-7" onClick={handlePrev}>
                        <ChevronLeft className="h-4 w-4" />
                         <span className="sr-only">Previous period</span>
                    </Button>
                    <span className="text-sm font-medium w-28 text-center tabular-nums">{periodLabel}</span>
                     <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleNext}>
                        <ChevronRight className="h-4 w-4" />
                         <span className="sr-only">Next period</span>
                    </Button>
                </div>
            </div>

            <div className="flex justify-between items-end mb-1">
                <p className="text-sm font-mono text-muted-foreground">
                    Spend
                </p>
                <p className="text-sm font-mono">
                    ${currentSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })} / ${tracker.targetAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
            </div>
            <Progress value={progressValue} />
             <div className="flex justify-between items-end mt-1 text-xs text-muted-foreground">
                <span>Start: {format(new Date(viewedPeriodStart), 'MMM dd, yyyy')}</span>
                <span>End: {format(new Date(periodEnd), 'MMM dd, yyyy')}</span>
            </div>
        </div>
    );
}
