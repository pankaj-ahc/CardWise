'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DUMMY_CARDS } from '@/lib/data';
import { type CardData } from '@/lib/types';
import { type CardFormValues } from '@/components/cards/add-edit-card-dialog';

interface CardContextType {
  cards: CardData[];
  addCard: (data: CardFormValues) => void;
  updateCard: (id: string, data: Partial<CardFormValues>) => void;
  deleteCard: (id: string) => void;
  getCard: (id: string) => CardData | undefined;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export function CardProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<CardData[]>(DUMMY_CARDS);

  const getCard = (id: string) => {
    return cards.find(c => c.id === id);
  };

  const addCard = (data: CardFormValues) => {
    const newCard: CardData = {
      ...data,
      id: `card-${new Date().getTime()}`,
      bills: [],
      spendTrackers: [],
      perks: [],
      dueDate: (data.billDate + 25) % 30 || 25,
      billingCycleStartMonth: 'January',
      feeWaiverCriteria: 'N/A',
    };
    setCards(prevCards => [newCard, ...prevCards]);
  };

  const updateCard = (id: string, data: Partial<CardFormValues>) => {
    setCards(prevCards =>
      prevCards.map(c => (c.id === id ? { ...c, ...data } : c))
    );
  };

  const deleteCard = (id: string) => {
    setCards(prevCards => prevCards.filter(c => c.id !== id));
  };

  return (
    <CardContext.Provider value={{ cards, addCard, updateCard, deleteCard, getCard }}>
      {children}
    </CardContext.Provider>
  );
}

export function useCards() {
  const context = useContext(CardContext);
  if (context === undefined) {
    throw new Error('useCards must be used within a CardProvider');
  }
  return context;
}
