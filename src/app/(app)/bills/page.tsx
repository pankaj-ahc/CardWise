'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, MoreHorizontal, Trash2, CreditCard } from 'lucide-react';
import { useCards } from '@/contexts/card-context';
import { type CardData, type Bill } from '@/lib/types';
import { AddEditBillDialog, type BillFormValues } from '@/components/cards/add-edit-bill-dialog';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
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
import { useSettings } from '@/contexts/settings-context';
import { getBankLogo } from '@/lib/banks';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type BillWithCard = Bill & { cardId: string; cardName: string; last4Digits?: string; bankName: string; color: string; };

export default function BillsPage() {
  const { cards, addBill, updateBill, toggleBillPaidStatus, deleteBill, loading } = useCards();
  const { currency } = useSettings();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<BillWithCard | undefined>(undefined);
  const [deletingBillInfo, setDeletingBillInfo] = useState<{ cardId: string; billId: string } | null>(null);
  const [displayedBills, setDisplayedBills] = useState<BillWithCard[]>([]);

  useEffect(() => {
    if (loading) return;

    // This logic is now inside useEffect to run only on the client
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const filteredBills = cards
      .flatMap(card => 
        card.bills
          .filter(bill => 
            !bill.paid || (bill.paymentDate && new Date(bill.paymentDate) > fifteenMinutesAgo)
          )
          .map(bill => ({
            ...bill,
            cardId: card.id,
            cardName: card.cardName,
            last4Digits: card.last4Digits,
            bankName: card.bankName,
            color: card.color,
          }))
      )
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      
    setDisplayedBills(filteredBills);

  }, [cards, loading]);

  const handleOpenAddDialog = () => {
    setEditingBill(undefined);
    setIsDialogOpen(true);
  };
  
  const handleOpenEditDialog = (bill: BillWithCard) => {
    setEditingBill(bill);
    setIsDialogOpen(true);
  }

  const handleSaveBill = async (data: BillFormValues & { id?: string }) => {
    const { id, cardId } = data;
    if (!cardId) return;
  
    const { id: _id, ...billData } = data;
  
    const isEditing = !!id;

    if (isEditing) {
      await updateBill(cardId, id, billData);
    } else {
      await addBill(cardId, billData);
    }

    toast({
        title: `Bill ${isEditing ? 'updated' : 'saved'}`,
        description: `Your bill for ${data.month} has been successfully ${isEditing ? 'updated' : 'saved'}.`,
    })
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBill(undefined);
  }
  
  const handleDeleteBill = () => {
    if (deletingBillInfo) {
      deleteBill(deletingBillInfo.cardId, deletingBillInfo.billId);
      setDeletingBillInfo(null);
    }
  }

  const renderContent = () => {
    if (loading) {
        return (
             <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        )
    }

    if (displayedBills.length > 0) {
        return (
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
                {displayedBills.map(bill => {
                  const bankLogo = getBankLogo(bill.bankName);
                  return (
                  <TableRow key={bill.id} data-state={bill.paid ? 'inactive' : 'active'}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={cn("rounded-lg flex items-center justify-center w-10 h-10", bankLogo ? "bg-card" : "")} style={!bankLogo ? { backgroundColor: bill.color } : {}}>
                            {bankLogo ? (
                                <img src={bankLogo} alt={`${bill.bankName} logo`} width="32" height="32" style={{ objectFit: 'contain' }} className="w-8 h-8" />
                            ) : (
                                <CreditCard className="w-6 h-6 text-white"/>
                            )}
                        </div>
                        <div>
                            <div className="font-medium">{bill.cardName}</div>
                            <div className="text-sm text-muted-foreground">{bill.bankName}{bill.last4Digits && ` •••• ${bill.last4Digits.slice(-4)}`}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{bill.month}</TableCell>
                    <TableCell className={cn(bill.amount <= 0 && "text-muted-foreground italic")}>{currency}{bill.amount.toFixed(2)}</TableCell>
                    <TableCell>{format(new Date(bill.dueDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <Switch
                        checked={bill.paid}
                        onCheckedChange={() => toggleBillPaidStatus(bill.cardId, bill.id)}
                        aria-label="Toggle paid status"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                       <AlertDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleOpenEditDialog(bill)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem 
                                        onSelect={(e) => { e.preventDefault(); setDeletingBillInfo({ cardId: bill.cardId, billId: bill.id }); }}
                                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete this bill record.
                                  </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setDeletingBillInfo(null)}>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleDeleteBill} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                )})}
              </TableBody>
            </Table>
        )
    }

    return (
        <div className="text-center text-muted-foreground py-8">
            All caught up! No unpaid or recently paid bills.
        </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-14 md:p-6 md:pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Manage Bills</h2>
        <Button onClick={handleOpenAddDialog}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Bill
        </Button>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Upcoming & Recent Bills</CardTitle>
            <CardDescription>A consolidated view of your credit card payments. Recently paid bills are shown for 15 minutes.</CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>

      <AddEditBillDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        onSave={handleSaveBill}
        bill={editingBill}
        cards={cards}
      />
    </div>
  );
}
