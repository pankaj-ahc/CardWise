
'use client';

import { useState, useMemo } from 'react';
import { useCards } from '@/contexts/card-context';
import { useSettings } from '@/contexts/settings-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter as UiTableFooter } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { getBankLogo } from '@/lib/banks';
import { CreditCard } from 'lucide-react';

export default function YearlySummaryPage() {
  const { cards, loading } = useCards();
  const { currency } = useSettings();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
  }, []);

  const { dataForTable, cardTotals, grandTotal } = useMemo(() => {
    if (loading) return { dataForTable: [], cardTotals: {}, grandTotal: 0 };

    const year = parseInt(selectedYear);
    const months = Array.from({ length: 12 }, (_, i) => format(new Date(year, i, 1), 'MMMM'));

    const tableData = months.map(monthName => {
      const row: { [key: string]: any } = { month: monthName };
      cards.forEach(card => {
        const billForMonth = card.bills.find(bill => bill.month === `${monthName} ${year}`);
        row[card.id] = billForMonth ? billForMonth.amount : 0;
      });
      return row;
    });

    const totals: { [key: string]: number } = {};
    let totalSum = 0;
    cards.forEach(card => {
      const cardTotal = tableData.reduce((sum, monthData) => sum + (monthData[card.id] || 0), 0);
      totals[card.id] = cardTotal;
      totalSum += cardTotal;
    });

    return { dataForTable: tableData, cardTotals: totals, grandTotal: totalSum };
  }, [cards, selectedYear, loading]);

  const renderLoading = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
            <div className="space-y-2">
                {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
        </CardContent>
    </Card>
  );

  const renderContent = () => {
    if (cards.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-8">
          You have no cards to display. Add some cards to get started.
        </div>
      );
    }
    
    return (
      <div className="overflow-x-auto">
        <Table className="min-w-full">
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                    <TableHead className="w-28 sticky left-0 bg-background z-10">Month</TableHead>
                    {cards.map(card => {
                      const bankLogo = getBankLogo(card.bankName);
                      return (
                        <TableHead key={card.id} className="min-w-40 text-center whitespace-nowrap">
                           <div className="flex flex-col items-center gap-2">
                                <div 
                                  className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white", bankLogo ? "bg-card p-1" : "")}
                                  style={!bankLogo ? { backgroundColor: card.color } : {}}
                                >
                                    {bankLogo ? (
                                        <img src={bankLogo} alt={`${card.bankName} logo`} width="32" height="32" style={{ objectFit: 'contain' }} className="w-8 h-8" />
                                    ) : (
                                        <CreditCard className="w-6 h-6"/>
                                    )}
                                </div>
                                <div className="text-foreground font-semibold">{card.cardName}</div>
                                <div className="text-xs text-muted-foreground">{card.bankName}</div>
                            </div>
                        </TableHead>
                      )
                    })}
                </TableRow>
            </TableHeader>
            <TableBody>
                {dataForTable.map((row, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium sticky left-0 bg-background z-10">{row.month}</TableCell>
                        {cards.map(card => (
                            <TableCell key={card.id} className={cn("text-center", row[card.id] <= 0 && "text-muted-foreground")}>
                                {row[card.id] > 0 ? `${currency}${row[card.id].toFixed(2)}` : (row[card.id] < 0 ? `-${currency}${Math.abs(row[card.id]).toFixed(2)}` : '-')}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
            <UiTableFooter>
                <TableRow className="bg-muted/50 hover:bg-muted/80">
                    <TableHead className="sticky left-0 bg-muted/50 z-10">Total</TableHead>
                    {cards.map(card => (
                        <TableHead key={card.id} className="text-center">
                            {currency}{cardTotals[card.id]?.toFixed(2) || '0.00'}
                        </TableHead>
                    ))}
                </TableRow>
            </UiTableFooter>
        </Table>
      </div>
    );
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Bill Summary</h2>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a year" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {loading ? renderLoading() : (
        <Card>
            <CardHeader>
                <CardTitle>Bill Summary</CardTitle>
                <CardDescription>A month-by-month breakdown of your total spend across all cards for {selectedYear}.</CardDescription>
            </CardHeader>
            <CardContent>
                {renderContent()}
            </CardContent>
            <CardFooter className="justify-end pt-6">
                <div className="text-right">
                    <p className="text-sm text-muted-foreground">Grand Total for {selectedYear}</p>
                    <p className="text-2xl font-bold">{currency}{grandTotal.toFixed(2)}</p>
                </div>
            </CardFooter>
        </Card>
      )}
    </div>
  );
}
