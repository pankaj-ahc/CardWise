'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BillsSection } from '@/components/cards/bills-section';
import { SpendTrackerSection } from '@/components/cards/spend-tracker-section';
import { AddEditCardDialog, type CardFormValues } from '@/components/cards/add-edit-card-dialog';
import { type CardData } from '@/lib/types';
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
} from "@/components/ui/alert-dialog"
import { useCards } from '@/contexts/card-context';

export default function CardDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { getCard, updateCard, deleteCard, cards } = useCards();

  const [card, setCard] = useState<CardData | undefined>(undefined);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    const foundCard = getCard(params.id);
    if (!foundCard) {
      router.replace('/cards');
    } else {
      setCard(foundCard);
    }
  }, [params.id, cards, getCard, router]);

  if (!card) {
    return <div className="flex-1 p-8">Loading card details...</div>;
  }

  const handleSaveCard = (data: CardFormValues & { id?: string }) => {
    if (data.id) {
      updateCard(data.id, data);
    }
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteCard = () => {
    deleteCard(card.id);
    router.push('/cards');
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
            <div>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/cards">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Cards
                    </Link>
                </Button>
            </div>
            <div className="flex items-center space-x-2">
                <Button size="sm" onClick={() => setIsEditDialogOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Card
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Card
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this
                        card and all associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteCard} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
      
        <Card>
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <div className="p-4 rounded-lg" style={{ backgroundColor: card.color }}>
                    <CreditCard className="w-8 h-8 text-white"/>
                </div>
                <div className="flex-grow">
                    <CardTitle className="text-2xl font-headline">{card.cardName}</CardTitle>
                    <CardDescription>{card.bankName} •••• {card.last4Digits}</CardDescription>
                     <div className="mt-2 flex flex-wrap gap-2">
                        {card.perks.map(perk => <Badge key={perk} variant="secondary">{perk}</Badge>)}
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-muted-foreground">Annual Fee</p>
                    <p className="text-lg font-bold">${card.annualFee}</p>
                </div>
            </CardHeader>
        </Card>

        <Tabs defaultValue="bills" className="space-y-4">
            <TabsList>
                <TabsTrigger value="bills">Bills</TabsTrigger>
                <TabsTrigger value="trackers">Spend Trackers</TabsTrigger>
            </TabsList>
            <TabsContent value="bills" className="space-y-4">
                <BillsSection cardId={card.id} bills={card.bills} />
            </TabsContent>
            <TabsContent value="trackers" className="space-y-4">
                <SpendTrackerSection cardId={card.id} trackers={card.spendTrackers} />
            </TabsContent>
        </Tabs>

        <AddEditCardDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSave={handleSaveCard}
            card={card}
        />
    </div>
  );
}
