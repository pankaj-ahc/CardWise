
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
import { CalendarIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { format, addMonths, subMonths } from 'date-fns';
import { type Bill, type CardData } from '@/lib/types';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSettings } from '@/contexts/settings-context';
import { useToast } from '@/hooks/use-toast';
import { MonthSelector } from '@/components/ui/month-selector';

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
  onSave: (bill: BillFormValues & { id?: string }) => Promise<void>;
  bill?: Bill & { cardId?: string };
  cards: CardData[];
  cardId?: string;
}

export function AddEditBillDialog({ open, onOpenChange, onSave, bill, cards, cardId }: AddEditBillDialogProps) {
  const { currency } = useSettings();
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  // This state tracks the ID of the bill currently being edited.
  // It's the source of truth for whether we are in "add" or "edit" mode.
  const [activeBillId, setActiveBillId] = useState<string | undefined>();

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
  const monthValue = form.watch('month');
  const dueDateValue = form.watch('dueDate');

  // Effect to initialize or reset the dialog when it opens or the initial `bill` prop changes.
  useEffect(() => {
    if (open) {
      const initialBill = bill;
      setActiveBillId(initialBill?.id);
      if (initialBill) {
        // Case 1: Editing a specific bill passed in as a prop (e.g., from "Edit" button)
        form.reset({
          cardId: initialBill.cardId,
          month: initialBill.month,
          amount: initialBill.amount,
          dueDate: new Date(initialBill.dueDate),
          paid: initialBill.paid,
        });
      } else {
        // Case 2: Adding a new bill
        form.reset({
          cardId: cardId || '',
          month: format(subMonths(new Date(), 1), 'MMMM yyyy'),
          amount: 0,
          dueDate: new Date(),
          paid: false,
        });
      }
    }
  }, [bill, open, form.reset, cardId]); // form.reset is stable

  // Effect to synchronize the month field when the due date is changed manually.
  // This helps keep the form consistent.
  useEffect(() => {
    if (dueDateValue && open) {
      const statementMonthDate = subMonths(dueDateValue, 1);
      const statementMonthString = format(statementMonthDate, 'MMMM yyyy');
      if (form.getValues('month') !== statementMonthString) {
        form.setValue('month', statementMonthString, { shouldValidate: true });
      }
    }
  }, [dueDateValue, open, form.getValues, form.setValue]); // getValues/setValue are stable


  // This effect is the core logic for switching between "add" and "edit" modes dynamically.
  // It runs whenever the selected card or month changes.
  useEffect(() => {
    // Don't run this logic if the dialog is closed or if no card is selected.
    if (!open || !selectedCardId || !monthValue) {
        return;
    }

    const card = cards.find(c => c.id === selectedCardId);
    const matchedBill = card?.bills.find(b => b.month === monthValue);

    if (matchedBill) {
      // A bill for this month already exists. Switch to edit mode for THAT bill.
      if (activeBillId !== matchedBill.id) {
        setActiveBillId(matchedBill.id);
        form.reset({
          cardId: selectedCardId,
          month: matchedBill.month,
          amount: matchedBill.amount,
          dueDate: new Date(matchedBill.dueDate),
          paid: matchedBill.paid,
        });
      }
    } else {
      // No bill exists for the selected month.
      // If we were previously editing a bill, switch to "add" mode.
      if (activeBillId) {
        setActiveBillId(undefined);
        // We keep the selected card and month, but reset the bill-specific fields.
        form.setValue('amount', 0);
        form.setValue('paid', false);
        // Note: We don't reset dueDate here, as it's linked to the month via the MonthSelector.
      }
    }
  }, [selectedCardId, monthValue, open, cards, activeBillId, form.reset, form.setValue]);


  const onSubmit = useCallback(async (data: BillFormValues) => {
    setIsSaving(true);
    const isEditing = !!activeBillId;
    try {
      await onSave({
        id: activeBillId,
        ...data,
      });

      toast({
        title: `Bill ${isEditing ? 'updated' : 'saved'}`,
        description: `Your bill for ${data.month} has been successfully ${isEditing ? 'updated' : 'saved'}.`,
      });

      // If we were adding a new bill, reset the form for the next one
      if (!isEditing) {
          const currentDueDate = form.getValues('dueDate');
          const newDueDate = addMonths(currentDueDate, 1);
          
          form.reset({
              ...form.getValues(), // keep cardId
              month: format(subMonths(newDueDate, 1), 'MMMM yyyy'),
              dueDate: newDueDate,
              amount: 0,
              paid: false,
          });
          setActiveBillId(undefined); // Ensure we are in "add" mode
          form.setFocus('amount');
      }
    } finally {
      setIsSaving(false);
    }
  }, [onSave, activeBillId, form, toast]);

  const title = activeBillId ? 'Edit Bill' : 'Add New Bill';
  const description = activeBillId ? 'A bill for this month already exists. You are editing it.' : 'Add a new bill record for a card.';

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
                    <MonthSelector
                      value={field.value}
                      currentDate={dueDateValue}
                      onMonthChange={(newMonth: string) => form.setValue('month', newMonth, { shouldValidate: true })}
                      onDateChange={(newDate: Date) => form.setValue('dueDate', newDate, { shouldValidate: true })}
                    />
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
               <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : activeBillId ? 'Update Bill' : 'Save Bill'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
