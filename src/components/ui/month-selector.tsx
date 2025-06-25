
'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addMonths, subMonths, format } from 'date-fns';

interface MonthSelectorProps {
  value: string;
  currentDate: Date;
  onMonthChange: (newMonth: string) => void;
  onDateChange: (newDate: Date) => void;
  disabled?: boolean;
}

export function MonthSelector({ value, currentDate, onMonthChange, onDateChange, disabled }: MonthSelectorProps) {

  const handleMonthChange = (direction: 'next' | 'prev') => {
    try {
      if (!currentDate || isNaN(currentDate.getTime())) {
        console.error("MonthSelector received an invalid date:", currentDate);
        return;
      }
      
      const newDueDate = direction === 'next' 
        ? addMonths(currentDate, 1) 
        : subMonths(currentDate, 1);

      const newStatementMonth = subMonths(newDueDate, 1);
      
      // Update the parent form's state. It's important to update the date first
      // so that any subsequent calculations based on it are correct.
      onDateChange(newDueDate);
      onMonthChange(format(newStatementMonth, 'MMMM yyyy'));

    } catch (e) {
        console.error("Error changing month:", e);
    }
  };

  return (
    <div className="flex items-center justify-between rounded-md border">
        <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => handleMonthChange('prev')}
            className="h-9 w-9"
            disabled={disabled}
        >
            <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-medium text-sm tabular-nums">{value}</span>
        <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => handleMonthChange('next')}
            className="h-9 w-9"
            disabled={disabled}
        >
            <ChevronRight className="h-4 w-4" />
        </Button>
    </div>
  );
}
