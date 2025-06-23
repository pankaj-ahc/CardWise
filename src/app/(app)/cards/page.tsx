import { Button } from '@/components/ui/button';
import { CardListItem } from '@/components/cards/card-list-item';
import { DUMMY_CARDS } from '@/lib/data';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function CardsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">My Cards</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Card
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {DUMMY_CARDS.map((card) => (
          <CardListItem key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
