
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardListItem } from '@/components/cards/card-list-item';
import { PlusCircle } from 'lucide-react';
import { AddEditCardDialog, type CardFormValues } from '@/components/cards/add-edit-card-dialog';
import { type CardData } from '@/lib/types';
import { useCards } from '@/contexts/card-context';
import { Skeleton } from '@/components/ui/skeleton';

export default function CardsPage() {
  const { cards, addCard, updateCard, deleteCard, loading } = useCards();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardData | undefined>(undefined);

  const handleSaveCard = (data: CardFormValues & { id?: string; color: string }) => {
    const { id, ...cardData } = data;
    if (id) {
      updateCard(id, cardData);
    } else {
      addCard(cardData);
    }
    setEditingCard(undefined);
    setIsDialogOpen(false);
  };

  const openEditDialog = (card: CardData) => {
    setEditingCard(card);
    setIsDialogOpen(true);
  }

  const openAddDialog = () => {
    setEditingCard(undefined);
    setIsDialogOpen(true);
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">My Cards</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={openAddDialog}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Card
          </Button>
        </div>
      </div>
      
      {loading ? (
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-[250px] w-full rounded-xl" />
                </div>
            ))}
        </div>
      ) : cards.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <CardListItem 
                key={card.id} 
                card={card}
                onEdit={() => openEditDialog(card)}
                onDelete={() => deleteCard(card.id)}
              />
            ))}
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-lg border border-dashed shadow-sm h-64">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">You have no cards</h3>
            <p className="text-sm text-muted-foreground">
              Get started by adding your first credit card.
            </p>
            <Button className="mt-4" onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Card
            </Button>
          </div>
        </div>
      )}


      <AddEditCardDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveCard}
        card={editingCard}
      />
    </div>
  );
}
