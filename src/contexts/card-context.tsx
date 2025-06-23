'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DUMMY_CARDS } from '@/lib/data';
import { type CardData, type Bill, type SpendTracker } from '@/lib/types';
import { type CardFormValues } from '@/components/cards/add-edit-card-dialog';
import type { BillFormValues } from '@/components/cards/add-edit-bill-dialog';
import type { SpendTrackerFormValues } from '@/components/cards/add-edit-spend-tracker-dialog';
import { format } from 'date-fns';

interface CardContextType {
  cards: CardData[];
  addCard: (data: CardFormValues) => void;
  updateCard: (id: string, data: Partial<CardFormValues>) => void;
  deleteCard: (id: string) => void;
  getCard: (id: string) => CardData | undefined;
  addBill: (cardId: string, data: BillFormValues) => void;
  updateBill: (cardId: string, billId: string, data: BillFormValues) => void;
  deleteBill: (cardId: string, billId: string) => void;
  toggleBillPaidStatus: (cardId: string, billId: string) => void;
  addSpendTracker: (cardId: string, data: SpendTrackerFormValues) => void;
  updateSpendTracker: (cardId: string, trackerId: string, data: SpendTrackerFormValues) => void;
  deleteSpendTracker: (cardId: string, trackerId: string) => void;
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

  const addBill = (cardId: string, data: BillFormValues) => {
    const newBill: Bill = {
      ...data,
      id: `bill-${new Date().getTime()}`,
      dueDate: format(data.dueDate, 'yyyy-MM-dd'),
    };
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === cardId
          ? { ...card, bills: [...card.bills, newBill].sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()) }
          : card
      )
    );
  };
  
  const updateBill = (cardId: string, billId: string, data: BillFormValues) => {
    setCards(prevCards =>
      prevCards.map(card => {
        if (card.id === cardId) {
          const updatedBills = card.bills.map(bill =>
            bill.id === billId ? { ...bill, ...data, dueDate: format(data.dueDate, 'yyyy-MM-dd') } : bill
          ).sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
          return { ...card, bills: updatedBills };
        }
        return card;
      })
    );
  };

  const deleteBill = (cardId: string, billId: string) => {
    setCards(prevCards =>
      prevCards.map(card => {
        if (card.id === cardId) {
          const updatedBills = card.bills.filter(bill => bill.id !== billId);
          return { ...card, bills: updatedBills };
        }
        return card;
      })
    );
  };

  const toggleBillPaidStatus = (cardId: string, billId: string) => {
    setCards(prevCards =>
      prevCards.map(card => {
        if (card.id === cardId) {
          const updatedBills = card.bills.map(bill => {
            if (bill.id === billId) {
              const isPaid = !bill.paid;
              return { 
                ...bill, 
                paid: isPaid, 
                paymentDate: isPaid ? format(new Date(), 'yyyy-MM-dd') : undefined
              };
            }
            return bill;
          });
          return { ...card, bills: updatedBills };
        }
        return card;
      })
    );
  };

  const addSpendTracker = (cardId: string, data: SpendTrackerFormValues) => {
    const newTracker: SpendTracker = {
      ...data,
      id: `tracker-${new Date().getTime()}`,
      startDate: format(data.startDate, 'yyyy-MM-dd'),
      endDate: format(data.endDate, 'yyyy-MM-dd'),
    };
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === cardId
          ? { ...card, spendTrackers: [...card.spendTrackers, newTracker] }
          : card
      )
    );
  };

  const updateSpendTracker = (cardId: string, trackerId: string, data: SpendTrackerFormValues) => {
    setCards(prevCards =>
      prevCards.map(card => {
        if (card.id === cardId) {
          const updatedTrackers = card.spendTrackers.map(tracker =>
            tracker.id === trackerId ? { 
                ...tracker, 
                ...data, 
                startDate: format(data.startDate, 'yyyy-MM-dd'), 
                endDate: format(data.endDate, 'yyyy-MM-dd') 
            } : tracker
          );
          return { ...card, spendTrackers: updatedTrackers };
        }
        return card;
      })
    );
  };

  const deleteSpendTracker = (cardId: string, trackerId: string) => {
    setCards(prevCards =>
      prevCards.map(card => {
        if (card.id === cardId) {
          const updatedTrackers = card.spendTrackers.filter(tracker => tracker.id !== trackerId);
          return { ...card, spendTrackers: updatedTrackers };
        }
        return card;
      })
    );
  };


  return (
    <CardContext.Provider value={{ cards, addCard, updateCard, deleteCard, getCard, addBill, updateBill, deleteBill, toggleBillPaidStatus, addSpendTracker, updateSpendTracker, deleteSpendTracker }}>
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
