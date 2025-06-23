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
import { format } from 'date-fns';
import { type Bill } from '@/lib/types';
import { useEffect } from 'react';

const billFormSchema = z.object({
  month: z.string().min(3, { message: 'Month must be at least 3 characters long.' }),
  amount: z.coerce.number().min(0, { message: 'Amount must be a positive number.' }),
  dueDate: z.date({ required_error: 'A due date is required.' }),
  paid: z.boolean().default(false),
});

export type BillFormValues = z.infer<typeof billFormSchema>;

interface AddEditBillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (bill: BillFormValues & { id?: string }) => void;
  bill?: Bill;
}

export function AddEditBillDialog({ open, onOpenChange, onSave, bill }: AddEditBillDialogProps) {
  const form = useForm<BillFormValues>({
    resolver: zodResolver(billFormSchema),
    defaultValues: {
      month: '',
      amount: 0,
      dueDate: new Date(),
      paid: false,
    },
  });

  useEffect(() => {
    if (open) {
      if (bill) {
        form.reset({
          month: bill.month,
          amount: bill.amount,
          dueDate: new Date(bill.dueDate),
          paid: bill.paid,
        });
      } else {
        form.reset({
          month: format(new Date(), 'MMMM yyyy'),
          amount: 0,
          dueDate: new Date(),
          paid: false,
        });
      }
    }
  }, [bill, open, form]);

  function onSubmit(data: BillFormValues) {
    onSave({
      id: bill?.id,
      ...data,
    });
    onOpenChange(false);
  }

  const title = bill ? 'Edit Bill' : 'Add New Bill';
  const description = bill ? 'Update the details of your monthly bill.' : 'Add a new bill record for this card.';

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
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Month</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. August 2024" {...field} />
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
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
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
