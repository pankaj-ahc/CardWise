
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { useSettings } from '@/contexts/settings-context';
import { getBankLogo } from '@/lib/banks';
import { cn } from '@/lib/utils';

export default function CardDetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const { getCard, updateCard, deleteCard, cards, loading } = useCards();
  const { currency } = useSettings();

  const [card, setCard] = useState<CardData | undefined>(undefined);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    // Wait until loading is false and params are available.
    if (loading || !params.id) return;

    const foundCard = getCard(params.id);
    if (foundCard) {
      setCard(foundCard);
    } else {
      // If done loading and card not found, redirect.
      router.replace('/cards');
    }
  }, [params.id, cards, getCard, router, loading]);

  useEffect(() => {
    // If we are on the root card page (e.g., /cards/123), redirect to the bills tab.
    if (params.id && pathname === `/cards/${params.id}`) {
        router.replace(`/cards/${params.id}/bills`);
    }
  }, [pathname, params, router]);

  if (loading || !card) {
    return <div className="flex-1 p-8">Loading card details...</div>;
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

  const activeTab = pathname.endsWith('/trackers') ? 'trackers' : 'bills';

  return (
    <div className="flex-1 space-y-4 p-4 pt-14 md:p-6 md:pt-6">
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
                <div 
                    className={cn("w-16 h-16 rounded-lg flex items-center justify-center", bankLogo ? "bg-card" : "")}
                    style={!bankLogo ? { backgroundColor: card.color } : {}}
                >
                     {bankLogo ? (
                        <img src={bankLogo} alt={`${card.bankName} logo`} width="48" height="48" style={{ objectFit: 'contain' }} className="w-12 h-12" />
                    ) : (
                        <CreditCard className="w-10 h-10 text-white"/>
                    )}
                </div>
                <div className="flex-grow">
                    <CardTitle className="text-2xl font-headline">{card.cardName}</CardTitle>
                    <CardDescription>{card.bankName}{card.last4Digits && ` •••• ${card.last4Digits.slice(-4)}`}</CardDescription>
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

        <Tabs value={activeTab} className="space-y-4">
            <TabsList>
                <TabsTrigger value="bills" asChild>
                    <Link href={`/cards/${card.id}/bills`}>Bills</Link>
                </TabsTrigger>
                <TabsTrigger value="trackers" asChild>
                    <Link href={`/cards/${card.id}/trackers`}>Spend Trackers</Link>
                </TabsTrigger>
            </TabsList>
        </Tabs>

        <div className="space-y-4">
            {children}
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
