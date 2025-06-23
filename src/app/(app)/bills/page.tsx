'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Manage Bills</h2>
      </div>

      <div className="space-y-6">
        {cards.map(card => {
          const unpaidBills = card.bills.filter(b => !b.paid)
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
          
          return (
            <Card key={card.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{card.cardName}</CardTitle>
                  <CardDescription>{card.bankName} •••• {card.last4Digits}</CardDescription>
                </div>
                <Button size="sm" onClick={() => handleOpenAddDialog(card)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Next Bill
                </Button>
              </CardHeader>
              <CardContent>
                {unpaidBills.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Paid</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unpaidBills.map(bill => (
                        <TableRow key={bill.id}>
                          <TableCell className="font-medium">{bill.month}</TableCell>
                          <TableCell>${bill.amount.toFixed(2)}</TableCell>
                          <TableCell>{format(new Date(bill.dueDate), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>
                            <Switch
                              checked={bill.paid}
                              onCheckedChange={() => toggleBillPaidStatus(card.id, bill.id)}
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
                                    <DropdownMenuItem onClick={() => handleOpenEditDialog(card.id, bill)}>
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
                  <div className="text-center text-muted-foreground py-4">
                    All caught up! No unpaid bills for this card.
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
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
