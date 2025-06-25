
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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type CardData, CARD_VARIANTS, type CardVariant } from '@/lib/types';
import React, { useEffect, type FC, type SVGProps, useState } from 'react';
import { useSettings } from '@/contexts/settings-context';
import { Combobox } from '@/components/ui/combobox';
import { popularBanks } from '@/lib/banks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '../ui/badge';
import { X } from 'lucide-react';

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
    { name: 'Visa Signature', logo: VisaLogo },
    { name: 'Visa Infinite', logo: VisaLogo },
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
  last4Digits: z.string().max(4, { message: 'Cannot be more than 4 characters.' }).optional(),
  cardVariant: z.enum(CARD_VARIANTS),
  dueDate: z.coerce.number().min(1).max(31, { message: "Must be a valid day of the month (1-31)."}),
  statementDate: z.preprocess(
      (val) => String(val).trim() === '' ? undefined : Number(val),
      z.number().min(1).max(31, { message: "Must be a valid day of the month (1-31)."}).optional()
  ),
  annualFee: z.coerce.number().min(0),
  creditLimit: z.preprocess(
      (val) => String(val).trim() === '' ? undefined : Number(val),
      z.number().min(0).optional()
  ),
  perks: z.array(z.string()).optional(),
  extraInfo: z.string().optional(),
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
  const [perkInput, setPerkInput] = useState('');

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      cardName: '',
      bankName: '',
      last4Digits: '',
      cardVariant: 'Other',
      dueDate: 1,
      statementDate: undefined,
      annualFee: 0,
      creditLimit: undefined,
      perks: [],
      extraInfo: '',
    },
  });

  const perks = form.watch('perks') || [];

  useEffect(() => {
    if (open) {
      if (card) {
        form.reset({
          cardName: card.cardName,
          bankName: card.bankName,
          last4Digits: card.last4Digits || '',
          cardVariant: card.cardVariant || 'Other',
          dueDate: card.dueDate,
          statementDate: card.statementDate,
          annualFee: card.annualFee,
          creditLimit: card.creditLimit,
          perks: card.perks || [],
          extraInfo: card.extraInfo || '',
        });
      } else {
        form.reset({
          cardName: '',
          bankName: '',
          last4Digits: '',
          cardVariant: 'Other',
          dueDate: 1,
          statementDate: undefined,
          annualFee: 0,
          creditLimit: undefined,
          perks: [],
          extraInfo: '',
        });
      }
      setPerkInput('');
    }
  }, [card, open, form]);

  const handleAddPerk = () => {
    const trimmedPerk = perkInput.trim();
    if (trimmedPerk && !perks.includes(trimmedPerk)) {
      form.setValue('perks', [...perks, trimmedPerk]);
      setPerkInput('');
    }
  };

  const handleRemovePerk = (perkToRemove: string) => {
    form.setValue('perks', perks.filter(p => p !== perkToRemove));
  };


  function onSubmit(data: CardFormValues) {
    const isKnownBank = popularBanks.some(b => b.name.toLowerCase() === data.bankName.toLowerCase());
    
    let finalColor: string;

    if (isKnownBank) {
      finalColor = 'hsl(217, 89%, 61%)';
    } else {
      if (card && card.bankName === data.bankName && card.color) {
        finalColor = card.color;
      } else {
        const hue = Math.floor(Math.random() * 360);
        finalColor = `hsl(${hue}, 70%, 50%)`;
      }
    }

    const saveData = { ...data };
    if (saveData.last4Digits) {
        saveData.last4Digits = saveData.last4Digits.slice(-4);
    }

    onSave({
      id: card?.id,
      ...saveData,
      color: finalColor,
    });
    onOpenChange(false);
  }
  
  const title = card ? 'Edit Card' : 'Add New Card';
  const description = card ? 'Update the details of your card.' : 'Fill in the information for your new credit card.';

  const bankOptions = popularBanks.map(bank => ({ value: bank.name, label: bank.name }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px] max-h-[90dvh] overflow-y-auto"
        onPointerDownOutside={(e) => {
           // Prevent closing on clicking outside the content
           const target = e.target as HTMLElement;
           if (target.closest('[data-radix-popper-content-wrapper]')) {
               e.preventDefault();
           }
        }}
        onEscapeKeyDown={(e) => {
          // Prevent closing with the Escape key
          e.preventDefault();
        }}
      >
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
                        placeholder="Select or type a bank"
                        searchPlaceholder="Search bank..."
                        emptyPlaceholder="Bank not found. Add a new one."
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
                    <FormLabel>Last 4 Digits (Optional)</FormLabel>
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
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="statementDate"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Statement Date (Day)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="Optional" {...field} value={field.value ?? ''} />
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
                    <FormLabel>Due Date (Day)</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="creditLimit"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Credit Limit ({currency})</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="Optional" {...field} value={field.value ?? ''} />
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
            </div>
            <FormField
              control={form.control}
              name="perks"
              render={() => (
                <FormItem>
                  <FormLabel>Perks & Benefits</FormLabel>
                   <div className="flex items-center gap-2">
                    <Input
                      placeholder="e.g. 5% Cashback"
                      value={perkInput}
                      onChange={(e) => setPerkInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddPerk();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={handleAddPerk}>
                      Add
                    </Button>
                  </div>
                  <FormDescription>
                    Add unique benefits or rewards for this card.
                  </FormDescription>
                  <div className="flex flex-wrap gap-2 pt-2 min-h-[24px]">
                    {perks.map((perk, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1 pl-2.5 pr-1 py-0.5">
                        {perk}
                        <button
                          type="button"
                          onClick={() => handleRemovePerk(perk)}
                          className="rounded-full hover:bg-muted-foreground/20 p-0.5"
                          aria-label={`Remove ${perk}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="extraInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Extra Info (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g. For travel expenses only" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
              <Button type="submit">Save card</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
