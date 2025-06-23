'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { type CardData, type Bill, type SpendTracker } from '@/lib/types';
import { type CardFormValues } from '@/components/cards/add-edit-card-dialog';
import type { BillFormValues } from '@/components/cards/add-edit-bill-dialog';
import type { SpendTrackerFormValues } from '@/components/cards/add-edit-spend-tracker-dialog';
import { format } from 'date-fns';
import { useAuth } from './auth-context';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, Timestamp } from 'firebase/firestore';

// Helper to convert Firestore Timestamps to ISO strings in nested objects/arrays
const convertTimestampsToISO = (data: any): any => {
    if (data instanceof Timestamp) {
        return data.toDate().toISOString();
    }
    if (Array.isArray(data)) {
        return data.map(item => convertTimestampsToISO(item));
    }
    if (data !== null && typeof data === 'object' && !Array.isArray(data)) {
        const res: { [key: string]: any } = {};
        for (const key in data) {
            res[key] = convertTimestampsToISO(data[key]);
        }
        return res;
    }
    return data;
};

interface CardContextType {
  cards: CardData[];
  loading: boolean;
  addCard: (data: CardFormValues) => Promise<void>;
  updateCard: (id: string, data: Partial<CardFormValues>) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  getCard: (id: string) => CardData | undefined;
  addBill: (cardId: string, data: BillFormValues) => Promise<void>;
  updateBill: (cardId: string, billId: string, data: BillFormValues) => Promise<void>;
  deleteBill: (cardId: string, billId: string) => Promise<void>;
  toggleBillPaidStatus: (cardId: string, billId: string) => Promise<void>;
  addSpendTracker: (cardId: string, data: SpendTrackerFormValues) => Promise<void>;
  updateSpendTracker: (cardId: string, trackerId: string, data: SpendTrackerFormValues) => Promise<void>;
  deleteSpendTracker: (cardId: string, trackerId: string) => Promise<void>;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export function CardProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCards = useCallback(async () => {
      if (!user) return;
      setLoading(true);
      try {
          const cardsCollectionRef = collection(db, 'users', user.uid, 'cards');
          const q = query(cardsCollectionRef, orderBy('cardName'));
          const querySnapshot = await getDocs(q);
          
          const fetchedCards = querySnapshot.docs.map(doc => (
            convertTimestampsToISO({ id: doc.id, ...doc.data() }) as CardData
          ));
          
          setCards(fetchedCards);
      } catch (error) {
          console.error("Error fetching cards:", error);
      } finally {
          setLoading(false);
      }
  }, [user]);

  useEffect(() => {
    if (user) {
        fetchCards();
    } else {
        // If user logs out, clear data and stop loading
        setCards([]);
        setLoading(false);
    }
  }, [user, fetchCards]);

  const getCard = (id: string) => cards.find(c => c.id === id);

  const addCard = async (data: CardFormValues) => {
      if (!user) return;
      const newCard: Omit<CardData, 'id'> = {
          ...data,
          bills: [],
          spendTrackers: [],
          perks: [],
          billingCycleStartMonth: 'January',
          feeWaiverCriteria: 'N/A',
      };
      const cardsCollectionRef = collection(db, 'users', user.uid, 'cards');
      await addDoc(cardsCollectionRef, newCard);
      await fetchCards();
  };

  const updateCard = async (id: string, data: Partial<CardFormValues>) => {
      if (!user) return;
      const cardDocRef = doc(db, 'users', user.uid, 'cards', id);
      await updateDoc(cardDocRef, data);
      await fetchCards();
  };

  const deleteCard = async (id: string) => {
      if (!user) return;
      const cardDocRef = doc(db, 'users', user.uid, 'cards', id);
      await deleteDoc(cardDocRef);
      await fetchCards();
  };

  const addBill = async (cardId: string, data: BillFormValues) => {
      if (!user) return;
      const card = getCard(cardId);
      if (!card) return;
      const newBill: Bill = {
          ...data,
          id: `bill-${new Date().getTime()}`,
          dueDate: format(data.dueDate, 'yyyy-MM-dd'),
      };
      const updatedBills = [...card.bills, newBill].sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
      const cardDocRef = doc(db, 'users', user.uid, 'cards', cardId);
      await updateDoc(cardDocRef, { bills: updatedBills });
      await fetchCards();
  };
  
  const updateBill = async (cardId: string, billId: string, data: BillFormValues) => {
      if (!user) return;
      const card = getCard(cardId);
      if (!card) return;
      const updatedBills = card.bills.map(bill =>
        bill.id === billId ? { ...bill, ...data, dueDate: format(data.dueDate, 'yyyy-MM-dd') } : bill
      ).sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
      const cardDocRef = doc(db, 'users', user.uid, 'cards', cardId);
      await updateDoc(cardDocRef, { bills: updatedBills });
      await fetchCards();
  };

  const deleteBill = async (cardId: string, billId: string) => {
      if (!user) return;
      const card = getCard(cardId);
      if (!card) return;
      const updatedBills = card.bills.filter(bill => bill.id !== billId);
      const cardDocRef = doc(db, 'users', user.uid, 'cards', cardId);
      await updateDoc(cardDocRef, { bills: updatedBills });
      await fetchCards();
  };

  const toggleBillPaidStatus = async (cardId: string, billId: string) => {
    if (!user) return;
    const card = getCard(cardId);
    if (!card) return;
    const updatedBills = card.bills.map(bill => {
      if (bill.id === billId) {
        const isPaid = !bill.paid;
        return { 
          ...bill, 
          paid: isPaid, 
          paymentDate: isPaid ? new Date().toISOString() : undefined
        };
      }
      return bill;
    });
    const cardDocRef = doc(db, 'users', user.uid, 'cards', cardId);
    await updateDoc(cardDocRef, { bills: updatedBills });
    await fetchCards();
  };

  const addSpendTracker = async (cardId: string, data: SpendTrackerFormValues) => {
    if (!user) return;
    const card = getCard(cardId);
    if (!card) return;
    const newTracker: SpendTracker = {
        id: `tracker-${new Date().getTime()}`,
        name: data.name,
        type: data.type,
        targetAmount: data.targetAmount,
        startDate: format(data.startDate, 'yyyy-MM-dd'),
    };
    const updatedTrackers = [...card.spendTrackers, newTracker];
    const cardDocRef = doc(db, 'users', user.uid, 'cards', cardId);
    await updateDoc(cardDocRef, { spendTrackers: updatedTrackers });
    await fetchCards();
  };

  const updateSpendTracker = async (cardId: string, trackerId: string, data: SpendTrackerFormValues) => {
    if (!user) return;
    const card = getCard(cardId);
    if (!card) return;
    const updatedTrackers = card.spendTrackers.map(tracker =>
      tracker.id === trackerId ? { 
          id: tracker.id, 
          name: data.name,
          type: data.type,
          targetAmount: data.targetAmount,
          startDate: format(data.startDate, 'yyyy-MM-dd'),
      } : tracker
    );
    const cardDocRef = doc(db, 'users', user.uid, 'cards', cardId);
    await updateDoc(cardDocRef, { spendTrackers: updatedTrackers });
    await fetchCards();
  };

  const deleteSpendTracker = async (cardId: string, trackerId: string) => {
    if (!user) return;
    const card = getCard(cardId);
    if (!card) return;
    const updatedTrackers = card.spendTrackers.filter(tracker => tracker.id !== trackerId);
    const cardDocRef = doc(db, 'users', user.uid, 'cards', cardId);
    await updateDoc(cardDocRef, { spendTrackers: updatedTrackers });
    await fetchCards();
  };

  const contextValue = { cards, loading, getCard, addCard, updateCard, deleteCard, addBill, updateBill, deleteBill, toggleBillPaidStatus, addSpendTracker, updateSpendTracker, deleteSpendTracker };

  return (
    <CardContext.Provider value={contextValue}>
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
