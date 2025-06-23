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
import { type CardData } from '@/lib/types';
import { useEffect } from 'react';
import { useSettings } from '@/contexts/settings-context';

const cardFormSchema = z.object({
  cardName: z.string().min(2, { message: 'Card name must be at least 2 characters.' }),
  bankName: z.string().min(2, { message: 'Bank name must be at least 2 characters.' }),
  last4Digits: z.string().length(4, { message: 'Must be 4 digits.' }).regex(/^\d{4}$/, { message: "Must be 4 digits." }),
  dueDate: z.coerce.number().min(1).max(31, { message: "Must be a valid day of the month (1-31)."}),
  annualFee: z.coerce.number().min(0),
  color: z.string().regex(/^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/, { message: "Must be a valid HSL color string, e.g., hsl(217, 89%, 61%)" }),
});

export type CardFormValues = z.infer<typeof cardFormSchema>;

interface AddEditCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (card: CardFormValues & { id?: string }) => void;
  card?: CardData;
}

export function AddEditCardDialog({ open, onOpenChange, onSave, card }: AddEditCardDialogProps) {
  const { currency } = useSettings();
  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      cardName: '',
      bankName: '',
      last4Digits: '',
      dueDate: 1,
      annualFee: 0,
      color: 'hsl(217, 89%, 61%)',
    },
  });

  useEffect(() => {
    if (open) {
      if (card) {
        form.reset({
          cardName: card.cardName,
          bankName: card.bankName,
          last4Digits: card.last4Digits,
          dueDate: card.dueDate,
          annualFee: card.annualFee,
          color: card.color,
        });
      } else {
        form.reset({
          cardName: '',
          bankName: '',
          last4Digits: '',
          dueDate: 1,
          annualFee: 0,
          color: 'hsl(217, 89%, 61%)',
        });
      }
    }
  }, [card, open, form]);

  function onSubmit(data: CardFormValues) {
    onSave({
      id: card?.id,
      ...data,
    });
    onOpenChange(false);
  }
  
  const title = card ? 'Edit Card' : 'Add New Card';
  const description = card ? 'Update the details of your card.' : 'Fill in the information for your new credit card.';


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
              name="cardName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Sapphire Preferred" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Chase" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="last4Digits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last 4 Digits</FormLabel>
                  <FormControl>
                    <Input placeholder="1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date (Day of Month)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="annualFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Fee ({currency})</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color (HSL)</FormLabel>
                  <FormControl>
                    <Input placeholder="hsl(217, 89%, 61%)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save card</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
