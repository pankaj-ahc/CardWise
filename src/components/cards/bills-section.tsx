'use client'

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, PlusCircle, Trash2 } from "lucide-react";
import { type Bill } from "@/lib/types";
import { useCards } from '@/contexts/card-context';
import { AddEditBillDialog, type BillFormValues } from './add-edit-bill-dialog';
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
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { useSettings } from '@/contexts/settings-context';
import { cn } from '@/lib/utils';

interface BillsSectionProps {
    cardId: string;
    bills: Bill[];
}

export function BillsSection({ cardId, bills }: BillsSectionProps) {
    const { cards, addBill, updateBill, deleteBill } = useCards();
    const { currency } = useSettings();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBill, setEditingBill] = useState<(Bill & { cardId: string; }) | undefined>(undefined);
    const [deletingBillId, setDeletingBillId] = useState<string | null>(null);

    const handleSaveBill = (data: BillFormValues & { id?: string }) => {
        const { id, ...billData } = data;
        if (id) {
            updateBill(cardId, id, billData);
        } else {
            addBill(cardId, billData);
        }
        setEditingBill(undefined);
        setIsDialogOpen(false);
    };

    const openEditDialog = (bill: Bill) => {
        setEditingBill({ ...bill, cardId });
        setIsDialogOpen(true);
    }
    
    const openAddDialog = () => {
        setEditingBill(undefined);
        setIsDialogOpen(true);
    }

    const handleDeleteBill = () => {
        if (deletingBillId) {
            deleteBill(cardId, deletingBillId);
            setDeletingBillId(null);
        }
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Monthly Bills</CardTitle>
                        <CardDescription>All recorded bills for this card.</CardDescription>
                    </div>
                    <Button size="sm" onClick={openAddDialog}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Bill
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Month</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bills.length > 0 ? bills.map((bill) => (
                                <TableRow key={bill.id}>
                                    <TableCell className="font-medium">{bill.month}</TableCell>
                                    <TableCell className={cn(bill.amount <= 0 && "text-muted-foreground italic")}>{currency}{bill.amount.toFixed(2)}</TableCell>
                                    <TableCell>{format(new Date(bill.dueDate), 'MMM dd, yyyy')}</TableCell>
                                    <TableCell>
                                        <Badge variant={bill.paid ? "default" : "secondary"} className={cn(bill.paid && "bg-green-500 hover:bg-green-500/90", bill.amount <= 0 && "bg-blue-500 hover:bg-blue-500/90")}>
                                            {bill.paid ? 'Paid' : (bill.amount <= 0 ? 'Recorded' : 'Unpaid')}
                                        </Badge>
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
                                                    <DropdownMenuItem onClick={() => openEditDialog(bill)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem 
                                                            onSelect={(e) => { e.preventDefault(); setDeletingBillId(bill.id); }}
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
                                                    <AlertDialogCancel onClick={() => setDeletingBillId(null)}>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleDeleteBill} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">
                                        No bills recorded yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <AddEditBillDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSave={handleSaveBill}
                bill={editingBill}
                cards={cards}
                cardId={cardId}
            />
        </>
    )
}
