'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { type Bill } from "@/lib/types";

interface BillsSectionProps {
    bills: Bill[];
}

export function BillsSection({ bills }: BillsSectionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Bills</CardTitle>
                <CardDescription>All recorded bills for this card.</CardDescription>
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
                        {bills.map((bill) => (
                            <TableRow key={bill.id}>
                                <TableCell className="font-medium">{bill.month}</TableCell>
                                <TableCell>${bill.amount.toFixed(2)}</TableCell>
                                <TableCell>{bill.dueDate}</TableCell>
                                <TableCell>
                                    <Badge variant={bill.paid ? "default" : "secondary"} className={bill.paid ? 'bg-green-500' : ''}>
                                        {bill.paid ? 'Paid' : 'Unpaid'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4"/>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
