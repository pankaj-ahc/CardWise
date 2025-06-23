
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
import { type CardData, CARD_VARIANTS, type CardVariant } from '@/lib/types';
import { useEffect, type FC, type SVGProps, useMemo } from 'react';
import { useSettings } from '@/contexts/settings-context';
import { Combobox } from '@/components/ui/combobox';
import { popularBanks } from '@/lib/banks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Simplified SVG components for logos
const VisaLogo: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="38" height="24" rx="3" fill="#1434CB"/>
    <text x="19" y="16" fontFamily="Arial, sans-serif" fontSize="9" fill="white" textAnchor="middle" fontWeight="bold">VISA</text>
  </svg>
);
const MastercardLogo: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="38" height="24" rx="3" fill="#fff" stroke="#ccc"/>
    <circle cx="13" cy="12" r="6" fill="#EB001B"/>
    <circle cx="25" cy="12" r="6" fill="#F79E1B"/>
    <path d="M19 12a6 6 0 01-6 5.95A6 6 0 0019 12a6 6 0 00-6-5.95A6 6 0 0119 12z" fill="#FF5F00"/>
  </svg>
);
const MaestroLogo: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="38" height="24" rx="3" fill="#fff" stroke="#ccc"/>
    <circle cx="13" cy="12" r="7" fill="#00A2E5"/>
    <circle cx="25" cy="12" r="7" fill="#E9001A"/>
  </svg>
);
const RuPayLogo: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="38" height="24" rx="3" fill="#fff" stroke="#ccc"/>
    <text x="19" y="16" fontFamily="Arial, sans-serif" fontSize="8" fill="#E45624" textAnchor="middle" fontWeight="bold">RuPay</text>
  </svg>
);
const AmericanExpressLogo: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="38" height="24" rx="3" fill="#006FCF"/>
    <text x="19" y="16" fontFamily="Arial, sans-serif" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">AMEX</text>
  </svg>
);
const DiscoverLogo: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="38" height="24" rx="3" fill="#F68A1E"/>
    <text x="19" y="16" fontFamily="Arial, sans-serif" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">Discover</text>
  </svg>
);
const GenericCardLogo: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="38" height="24" rx="3" fill="#E0E0E0"/>
    <text x="19" y="16" fontFamily="Arial, sans-serif" fontSize="8" fill="#333" textAnchor="middle" fontWeight="bold">Card</text>
  </svg>
);

export interface CardVariantInfo {
    name: CardVariant;
    logo: FC<SVGProps<SVGSVGElement>>;
}

export const cardVariantList: readonly CardVariantInfo[] = [
    { name: 'Visa', logo: VisaLogo },
    { name: 'Mastercard', logo: MastercardLogo },
    { name: 'American Express', logo: AmericanExpressLogo },
    { name: 'Discover', logo: DiscoverLogo },
    { name: 'RuPay', logo: RuPayLogo },
    { name: 'Maestro', logo: MaestroLogo },
    { name: 'Other', logo: GenericCardLogo },
];


const cardFormSchema = z.object({
  cardName: z.string().min(2, { message: 'Card name must be at least 2 characters.' }),
  bankName: z.string().min(2, { message: 'Bank name must be at least 2 characters.' }),
  last4Digits: z.string().length(4, { message: 'Must be 4 digits.' }).regex(/^\d{4}$/, { message: "Must be 4 digits." }),
  cardVariant: z.enum(CARD_VARIANTS),
  dueDate: z.coerce.number().min(1).max(31, { message: "Must be a valid day of the month (1-31)."}),
  annualFee: z.coerce.number().min(0),
  color: z.string().regex(/^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/, { message: "Must be a valid HSL color string, e.g., hsl(217, 89%, 61%)" }).optional(),
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
      cardVariant: 'Other',
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
          cardVariant: card.cardVariant || 'Other',
          dueDate: card.dueDate,
          annualFee: card.annualFee,
          color: card.color,
        });
      } else {
        form.reset({
          cardName: '',
          bankName: '',
          last4Digits: '',
          cardVariant: 'Other',
          dueDate: 1,
          annualFee: 0,
          color: 'hsl(217, 89%, 61%)',
        });
      }
    }
  }, [card, open, form]);

  function onSubmit(data: CardFormValues) {
    const isKnownBank = popularBanks.some(b => b.name.toLowerCase() === data.bankName.toLowerCase());
    
    let finalColor: string;

    if (isKnownBank) {
      // For known banks, use a default color. This will be used as a fallback or ignored if the logo loads.
      finalColor = 'hsl(217, 89%, 61%)';
    } else {
      // If it's a custom bank, either keep its existing color or generate a new one.
      if (card && card.bankName === data.bankName && card.color) {
        finalColor = card.color;
      } else {
        const hue = Math.floor(Math.random() * 360);
        finalColor = `hsl(${hue}, 70%, 50%)`;
      }
    }

    onSave({
      id: card?.id,
      ...data,
      color: finalColor,
    });
    onOpenChange(false);
  }
  
  const title = card ? 'Edit Card' : 'Add New Card';
  const description = card ? 'Update the details of your card.' : 'Fill in the information for your new credit card.';

  const bankOptions = popularBanks.map(bank => ({ value: bank.name, label: bank.name }));

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
                <FormItem className="flex flex-col">
                  <FormLabel>Bank Name</FormLabel>
                   <FormControl>
                     <Combobox
                        options={bankOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select a bank"
                        searchPlaceholder="Search bank or type custom..."
                        emptyPlaceholder="Bank not found."
                      />
                   </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-2 gap-4">
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
                name="cardVariant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Network</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select network" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cardVariantList.map(({ name, logo: Logo }) => (
                          <SelectItem key={name} value={name}>
                            <div className="flex items-center gap-2">
                              <Logo />
                              <span>{name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
             </div>
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
            <DialogFooter>
              <Button type="submit">Save card</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
