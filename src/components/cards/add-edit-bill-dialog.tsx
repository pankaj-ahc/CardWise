'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { format, addMonths, subMonths } from 'date-fns';
import { type Bill, type CardData } from '@/lib/types';
import { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSettings } from '@/contexts/settings-context';

const billFormSchema = z.object({
  cardId: z.string({ required_error: 'A card is required.' }).min(1, { message: 'Please select a card.' }),
  month: z.string().min(3, { message: 'Month must be at least 3 characters long.' }),
  amount: z.coerce.number(),
  dueDate: z.date({ required_error: 'A due date is required.' }),
  paid: z.boolean().default(false),
});

export type BillFormValues = z.infer<typeof billFormSchema>;

interface AddEditBillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (bill: BillFormValues & { id?: string }) => void;
  bill?: Bill & { cardId?: string };
  cards: CardData[];
  cardId?: string;
}

export function AddEditBillDialog({ open, onOpenChange, onSave, bill, cards, cardId }: AddEditBillDialogProps) {
  const { currency } = useSettings();
  const form = useForm<BillFormValues>({
    resolver: zodResolver(billFormSchema),
    defaultValues: {
      cardId: '',
      month: '',
      amount: 0,
      dueDate: new Date(),
      paid: false,
    },
  });

  const selectedCardId = form.watch('cardId');
  const dueDateValue = form.watch('dueDate');

  useEffect(() => {
    if (open) {
      if (bill) {
        form.reset({
          cardId: bill.cardId,
          month: bill.month,
          amount: bill.amount,
          dueDate: new Date(bill.dueDate),
          paid: bill.paid,
        });
      } else {
        form.reset({
          cardId: cardId || '',
          month: format(new Date(), 'MMMM yyyy'),
          amount: 0,
          dueDate: new Date(),
          paid: false,
        });
      }
    }
  }, [bill, open, form, cardId]);

  useEffect(() => {
    if (open && !bill?.id && selectedCardId) {
        const card = cards.find(c => c.id === selectedCardId);
        if (card) {
            const latestBill = card.bills.length > 0
                ? [...card.bills].sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())[0]
                : null;

            let nextDueDate: Date;
            if (latestBill) {
                const lastDueDate = new Date(latestBill.dueDate);
                // Calculate next month's due date based on the last bill's month and the card's specific due day.
                nextDueDate = new Date(lastDueDate.getFullYear(), lastDueDate.getMonth() + 1, card.dueDate);
            } else {
                const now = new Date();
                // For the first bill, set it to next month, using the card's due day.
                nextDueDate = new Date(now.getFullYear(), now.getMonth() + 1, card.dueDate);
            }
            
            form.setValue('dueDate', nextDueDate, { shouldValidate: true });
            form.setValue('month', format(addMonths(nextDueDate, -1), 'MMMM yyyy'), { shouldValidate: true });
        }
    }
  }, [selectedCardId, open, bill, cards, form]);

  useEffect(() => {
    // This effect synchronizes the month field when the due date is changed manually.
    if (dueDateValue) {
        const statementMonth = format(addMonths(dueDateValue, -1), 'MMMM yyyy');
        if (form.getValues('month') !== statementMonth) {
            form.setValue('month', statementMonth, { shouldValidate: true });
        }
    }
  }, [dueDateValue, form]);

  const handleMonthChange = (direction: 'next' | 'prev') => {
    const currentMonthStr = form.getValues('month');
    try {
      const [monthName, yearStr] = currentMonthStr.split(' ');
      const year = parseInt(yearStr, 10);
      const monthIndex = new Date(Date.parse(monthName + " 1, " + year)).getMonth();
      
      let currentStatementDate = new Date(year, monthIndex, 1);

      if (isNaN(currentStatementDate.getTime())) {
          console.error("Could not parse month string:", currentMonthStr);
          return;
      }

      const newStatementDate = direction === 'next' ? addMonths(currentStatementDate, 1) : subMonths(currentStatementDate, 1);
      
      form.setValue('month', format(newStatementDate, 'MMMM yyyy'), { shouldValidate: true });
      
      const currentDueDate = form.getValues('dueDate');
      const dayOfDueDate = new Date(currentDueDate).getDate();

      const newDueDate = new Date(newStatementDate.getFullYear(), newStatementDate.getMonth() + 1, dayOfDueDate);
      form.setValue('dueDate', newDueDate, { shouldValidate: true });

    } catch (e) {
        console.error("Error changing month:", e);
    }
  };


  function onSubmit(data: BillFormValues) {
    onSave({
      id: bill?.id,
      ...data,
    });
    onOpenChange(false);
  }

  const title = bill?.id ? 'Edit Bill' : 'Add New Bill';
  const description = bill?.id ? 'Update the details of your monthly bill.' : 'Add a new bill record for a card.';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card</FormLabel>
                   <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value} disabled={!!bill?.id || !!cardId}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a card" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cards.map(card => (
                        <SelectItem key={card.id} value={card.id}>
                          {`${card.cardName} (${card.bankName})`} {card.last4Digits && `(•••• ${card.last4Digits.slice(-4)})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Month</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between rounded-md border">
                        <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() => handleMonthChange('prev')}
                            disabled={!selectedCardId}
                            className="h-9 w-9"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="font-medium text-sm tabular-nums">{field.value}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() => handleMonthChange('next')}
                            disabled={!selectedCardId}
                            className="h-9 w-9"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ({currency})</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter a negative amount for refunds or credits.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date('1900-01-01')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paid"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Paid Status</FormLabel>
                    <FormDescription>
                      Is this bill marked as paid?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save Bill</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
