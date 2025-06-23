'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlusCircle, Edit, MoreHorizontal } from 'lucide-react';
import { useCards } from '@/contexts/card-context';
import { type CardData, type Bill } from '@/lib/types';
import { AddEditBillDialog, type BillFormValues } from '@/components/cards/add-edit-bill-dialog';
import { format, addMonths } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

export default function BillsPage() {
  const { cards, addBill, updateBill, toggleBillPaidStatus } = useCards();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | undefined>(undefined);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const handleOpenAddDialog = (card: CardData) => {
    setActiveCardId(card.id);

    const latestBill = card.bills.length > 0
      ? [...card.bills].sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())[0]
      : null;

    let nextDueDate: Date;
    if (latestBill) {
      nextDueDate = addMonths(new Date(latestBill.dueDate), 1);
    } else {
      const now = new Date();
      nextDueDate = new Date(now.getFullYear(), now.getMonth() + 1, card.dueDate);
    }
    
    const newBillData = {
      month: format(addMonths(nextDueDate, -1), 'MMMM yyyy'),
      amount: 0,
      dueDate: nextDueDate,
      paid: false,
    };

    setEditingBill(newBillData as any);
    setIsDialogOpen(true);
  };
  
  const handleOpenEditDialog = (cardId: string, bill: Bill) => {
    setActiveCardId(cardId);
    setEditingBill(bill);
    setIsDialogOpen(true);
  }

  const handleSaveBill = (data: BillFormValues & { id?: string }) => {
    if (!activeCardId) return;

    if (data.id) {
      updateBill(activeCardId, data.id, data);
    } else {
      addBill(activeCardId, data);
    }
    setIsDialogOpen(false);
    setEditingBill(undefined);
    setActiveCardId(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBill(undefined);
    setActiveCardId(null);
  }
  
  const allUnpaidBills = cards
    .flatMap(card => 
      card.bills
        .filter(bill => !bill.paid)
        .map(bill => ({
          ...bill,
          cardId: card.id,
          cardName: card.cardName,
          last4Digits: card.last4Digits
        }))
    )
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Manage Bills</h2>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>All Unpaid Bills</CardTitle>
            <CardDescription>A consolidated view of all your upcoming credit card payments.</CardDescription>
        </CardHeader>
        <CardContent>
          {allUnpaidBills.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Card</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allUnpaidBills.map(bill => (
                  <TableRow key={bill.id}>
                    <TableCell className="font-medium">
                        <div>{bill.cardName}</div>
                        <div className="text-sm text-muted-foreground">•••• {bill.last4Digits}</div>
                    </TableCell>
                    <TableCell>{bill.month}</TableCell>
                    <TableCell>${bill.amount.toFixed(2)}</TableCell>
                    <TableCell>{format(new Date(bill.dueDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <Switch
                        checked={bill.paid}
                        onCheckedChange={() => toggleBillPaidStatus(bill.cardId, bill.id)}
                        aria-label="Toggle paid status"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4"/>
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenEditDialog(bill.cardId, bill)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                              </DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              All caught up! No unpaid bills.
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="space-y-2 pt-6">
        <h3 className="text-2xl font-bold tracking-tight font-headline">Add New Bills</h3>
        <p className="text-muted-foreground">Select a card to add the next upcoming bill. The due date will be calculated automatically.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map(card => (
            <Card key={card.id}>
              <CardHeader>
                <CardTitle>{card.cardName}</CardTitle>
                <CardDescription>{card.bankName} •••• {card.last4Digits}</CardDescription>
              </CardHeader>
              <CardFooter>
                 <Button onClick={() => handleOpenAddDialog(card)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Next Bill
                </Button>
              </CardFooter>
            </Card>
        ))}
      </div>

      <AddEditBillDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        onSave={handleSaveBill}
        bill={editingBill}
      />
    </div>
  );
}
