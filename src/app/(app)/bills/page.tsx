
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, MoreHorizontal, Trash2, CreditCard, CheckCircle2 } from 'lucide-react';
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
  const [dialogAction, setDialogAction] = useState<'delete' | 'toggle' | null>(null);
  const [selectedBillForAction, setSelectedBillForAction] = useState<BillWithCard | null>(null);
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
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBill(undefined);
  }
  
  const handleConfirmAction = () => {
    if (!selectedBillForAction) return;

    if (dialogAction === 'delete') {
      deleteBill(selectedBillForAction.cardId, selectedBillForAction.id);
      toast({
        title: "Bill Deleted",
        description: `The bill for ${selectedBillForAction.month} has been deleted.`,
      })
    } else if (dialogAction === 'toggle') {
      toggleBillPaidStatus(selectedBillForAction.cardId, selectedBillForAction.id);
      toast({
        title: `Bill status updated`,
        description: `The bill for ${selectedBillForAction.month} has been marked as ${!selectedBillForAction.paid ? 'paid' : 'unpaid'}.`,
      })
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
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
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
                         <AlertDialog onOpenChange={(open) => { if (!open) setSelectedBillForAction(null) }}>
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
                                          onSelect={(e) => { e.preventDefault(); setDialogAction('delete'); setSelectedBillForAction(bill); }}
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
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleConfirmAction} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  )})}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden space-y-3">
              {displayedBills.map(bill => {
                const bankLogo = getBankLogo(bill.bankName);
                return (
                  <div key={bill.id} className="rounded-lg border bg-card text-card-foreground shadow-sm" data-state={bill.paid ? 'inactive' : 'active'}>
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={cn("rounded-lg flex items-center justify-center w-10 h-10 flex-shrink-0", bankLogo ? "bg-card" : "")} style={!bankLogo ? { backgroundColor: bill.color } : {}}>
                            {bankLogo ? (
                                <img src={bankLogo} alt={`${bill.bankName} logo`} width="32" height="32" style={{ objectFit: 'contain' }} className="w-8 h-8" />
                            ) : (
                                <CreditCard className="w-6 h-6 text-white"/>
                            )}
                        </div>
                        <div className="truncate">
                            <div className="font-medium truncate">{bill.cardName}</div>
                            <div className="text-sm text-muted-foreground truncate">{bill.bankName}{bill.last4Digits && ` •••• ${bill.last4Digits.slice(-4)}`}</div>
                        </div>
                      </div>
                      <AlertDialog onOpenChange={(open) => { if (!open) { setDialogAction(null); setSelectedBillForAction(null); }}}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="flex-shrink-0">
                                  <MoreHorizontal className="h-4 w-4"/>
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setDialogAction('toggle'); setSelectedBillForAction(bill); }}>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    <span>{bill.paid ? 'Mark as Unpaid' : 'Mark as Paid'}</span>
                                  </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <DropdownMenuItem onClick={() => handleOpenEditDialog(bill)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                              </DropdownMenuItem>
                              <AlertDialogTrigger asChild>
                                  <DropdownMenuItem 
                                      onSelect={(e) => { e.preventDefault(); setDialogAction('delete'); setSelectedBillForAction(bill); }}
                                      className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                  >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                  </DropdownMenuItem>
                              </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                          {dialogAction === 'toggle' ? (
                            <>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to mark this bill as {selectedBillForAction?.paid ? 'unpaid' : 'paid'}?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleConfirmAction}>Confirm</AlertDialogAction>
                              </AlertDialogFooter>
                            </>
                          ) : (
                            <>
                              <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete this bill record.
                                  </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleConfirmAction} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </>
                          )}
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                     <div className="border-t p-4 grid grid-cols-3 gap-2 text-center">
                        <div>
                            <div className="text-xs text-muted-foreground">Month</div>
                            <div className="text-sm font-medium truncate">{bill.month}</div>
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground">Amount</div>
                            <div className={cn("text-sm font-medium", bill.amount <= 0 && "text-muted-foreground italic font-normal")}>{currency}{bill.amount.toFixed(2)}</div>
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground">Due Date</div>
                            <div className="text-sm font-medium">{format(new Date(bill.dueDate), 'MMM dd, yy')}</div>
                        </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )
    }

    return (
        <div className="text-center text-muted-foreground py-8">
            All caught up! No unpaid or recently paid bills.
        </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-6">
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
