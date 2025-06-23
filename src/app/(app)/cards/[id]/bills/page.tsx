
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCards } from '@/contexts/card-context';
import { BillsSection } from '@/components/cards/bills-section';
import { type CardData } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function CardBillsPage() {
  const params = useParams<{ id: string }>();
  const { getCard, loading, cards } = useCards();
  const [card, setCard] = useState<CardData | undefined>(undefined);

  useEffect(() => {
    if (!loading && params.id) {
      const foundCard = getCard(params.id);
      setCard(foundCard);
    }
  }, [loading, params.id, getCard, cards]);


  if (loading || !card) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
           <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </CardContent>
      </Card>
    );
  }

  return <BillsSection cardId={card.id} bills={card.bills} />;
}
