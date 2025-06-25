
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
      // The statement month is the month *before* the due date.
      const currentStatementDate = subMonths(currentDate, 1);

      if (isNaN(currentStatementDate.getTime())) {
          console.error("Could not parse date from currentDate prop:", currentDate);
          return;
      }
      
      const newStatementDate = direction === 'next' ? addMonths(currentStatementDate, 1) : subMonths(currentStatementDate, 1);
      
      // Update the month string field in the parent form
      onMonthChange(format(newStatementDate, 'MMMM yyyy'));
      
      // Also update the due date field in the parent form
      const dayOfDueDate = currentDate.getDate();
      const newDueDate = new Date(newStatementDate.getFullYear(), newStatementDate.getMonth() + 1, dayOfDueDate);
      
      onDateChange(newDueDate);

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
