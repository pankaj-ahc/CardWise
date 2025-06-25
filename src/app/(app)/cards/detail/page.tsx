
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "@/components/ui/alert-dialog";
import { useCards } from '@/contexts/card-context';
import { useSettings } from '@/contexts/settings-context';
import { getBankAbbreviation, getBankLogo } from '@/lib/banks';
import { cn } from '@/lib/utils';
import { BillsSection } from '@/components/cards/bills-section';
import { SpendTrackerSection } from '@/components/cards/spend-tracker-section';
import { Skeleton } from '@/components/ui/skeleton';

function CardDetailPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getCard, updateCard, deleteCard, cards, loading } = useCards();
  const { currency } = useSettings();

  const id = searchParams.get('id');
  const activeTab = searchParams.get('tab') || 'bills';

  const [card, setCard] = useState<CardData | undefined>(undefined);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (loading || !id) return;
    const foundCard = getCard(id);
    if (foundCard) {
      setCard(foundCard);
    } else if (!loading) {
      router.replace('/cards');
    }
  }, [id, cards, getCard, router, loading]);

  const handleTabChange = (newTab: string) => {
    // Using router.push to ensure the URL updates and the component re-renders with the new tab state
    router.push(`/cards/detail?id=${id}&tab=${newTab}`);
  };

  if (loading || !card) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-32" />
            <div className="flex items-center space-x-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-28" />
            </div>
        </div>
        <Card>
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <Skeleton className="w-16 h-16 rounded-lg" />
                <div className="flex-grow space-y-2">
                    <Skeleton className="h-7 w-1/2" />
                    <Skeleton className="h-5 w-1/3" />
                </div>
            </CardHeader>
        </Card>
        <Skeleton className="h-10 w-48" />
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
                <div className="space-y-2 pt-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
        </Card>
      </div>
    );
  }

  const bankLogo = getBankLogo(card.bankName);

  const handleSaveCard = (data: CardFormValues & { id?: string; color: string }) => {
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
          <div className={cn("w-16 h-16 rounded-lg flex items-center justify-center", bankLogo ? "bg-card" : "")} style={!bankLogo ? { backgroundColor: card.color } : {}}>
            {bankLogo ? (
              <img src={bankLogo} alt={`${card.bankName} logo`} width="48" height="48" style={{ objectFit: 'contain' }} className="w-12 h-12" />
            ) : (
              <CreditCard className="w-10 h-10 text-white"/>
            )}
          </div>
          <div className="flex-grow">
            <CardTitle className="text-2xl font-headline">{`${card.cardName} (${getBankAbbreviation(card.bankName)})`}</CardTitle>
            <CardDescription>{card.last4Digits && `•••• ${card.last4Digits.slice(-4)}`}</CardDescription>
            <div className="mt-2 flex flex-wrap gap-2">
              {card.perks.map(perk => <Badge key={perk} variant="secondary">{perk}</Badge>)}
            </div>
            {card.extraInfo && (
              <p className="text-sm text-muted-foreground mt-2">{card.extraInfo}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Annual Fee</p>
            <p className="text-lg font-bold">{currency}{card.annualFee}</p>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="bills">Bills</TabsTrigger>
          <TabsTrigger value="trackers">Spend Trackers</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="space-y-4">
        {activeTab === 'bills' && <BillsSection cardId={card.id} bills={card.bills} />}
        {activeTab === 'trackers' && <SpendTrackerSection cardId={card.id} trackers={card.spendTrackers} bills={card.bills} />}
      </div>

      <AddEditCardDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveCard}
        card={card}
      />
    </div>
  );
}

// A Suspense boundary is required for any page that uses the useSearchParams hook.
export default function CardDetailPage() {
    return (
        <Suspense>
            <CardDetailPageContent />
        </Suspense>
    )
}
