
'use client';

import { useEffect, useState } from 'react';
import { useCards } from '@/contexts/card-context';
import { SpendTrackerSection } from '@/components/cards/spend-tracker-section';
import { type CardData } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface CardTrackersClientPageProps {
  cardId: string;
}

export default function CardTrackersClientPage({ cardId }: CardTrackersClientPageProps) {
  const { getCard, loading, cards } = useCards();
  const [card, setCard] = useState<CardData | undefined>(undefined);

  useEffect(() => {
    if (!loading && cardId) {
      const foundCard = getCard(cardId);
      setCard(foundCard);
    }
  }, [loading, cardId, getCard, cards]);


  if (loading || !card) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6 pt-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return <SpendTrackerSection cardId={card.id} trackers={card.spendTrackers} bills={card.bills} />;
}
