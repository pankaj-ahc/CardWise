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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format, startOfYear, startOfQuarter, startOfMonth } from 'date-fns';
import { type SpendTracker } from '@/lib/types';
import { useEffect } from 'react';

const spendTrackerFormSchema = z.object({
  name: z.string().min(2, { message: 'Tracker name is required.' }),
  type: z.enum(['Annual', 'Quarterly', 'Monthly'], { required_error: 'A type is required.' }),
  targetAmount: z.coerce.number().min(0, { message: 'Target amount must be positive.' }),
  startDate: z.date({ required_error: 'A start date is required.' }),
});

export type SpendTrackerFormValues = z.infer<typeof spendTrackerFormSchema>;

interface AddEditSpendTrackerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (tracker: SpendTrackerFormValues & { id?: string }) => void;
  tracker?: SpendTracker;
}

export function AddEditSpendTrackerDialog({ open, onOpenChange, onSave, tracker }: AddEditSpendTrackerDialogProps) {
  const form = useForm<SpendTrackerFormValues>({
    resolver: zodResolver(spendTrackerFormSchema),
    defaultValues: {
      name: '',
      type: 'Quarterly',
      targetAmount: 0,
      startDate: new Date(),
    },
  });

  const trackerType = form.watch('type');

  useEffect(() => {
    if (open) {
      if (tracker) {
        form.reset({
          name: tracker.name,
          type: tracker.type,
          targetAmount: tracker.targetAmount,
          startDate: new Date(tracker.startDate),
        });
      } else {
        form.reset({
          name: '',
          type: 'Quarterly',
          targetAmount: 0,
          startDate: startOfQuarter(new Date()),
        });
      }
    }
  }, [tracker, open, form]);

  useEffect(() => {
    if (!open || !!tracker?.id) return; // Only applies for new trackers.

    const now = new Date();
    let start;

    switch(trackerType) {
        case 'Monthly':
            start = startOfMonth(now);
            break;
        case 'Quarterly':
            start = startOfQuarter(now);
            break;
        case 'Annual':
            start = startOfYear(now);
            break;
        default:
            return;
    }

    form.setValue('startDate', start, { shouldValidate: true });

  }, [trackerType, open, tracker, form]);

  function onSubmit(data: SpendTrackerFormValues) {
    onSave({
      id: tracker?.id,
      ...data,
    });
    onOpenChange(false);
  }

  const title = tracker?.id ? 'Edit Spend Tracker' : 'Add New Spend Tracker';
  const description = tracker?.id ? 'Update the details of your spend tracker.' : 'Add a new tracker to monitor your spending goals.';

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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tracker Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Sign-up Bonus" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Annual">Annual</SelectItem>
                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
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
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save Tracker</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
