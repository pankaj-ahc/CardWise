
'use client';

import { useCards } from '@/contexts/card-context';
import { useSettings } from '@/contexts/settings-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CreditCard } from 'lucide-react';
import { getBankLogo } from '@/lib/banks';
import { cn } from '@/lib/utils';

export default function ComparePage() {
  const { cards, loading } = useCards();
  const { currency } = useSettings();

  const renderLoading = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
            <div className="overflow-x-auto">
                <div className="flex space-x-4 p-4">
                    <div className="w-48 flex-shrink-0 space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                    <div className="w-64 flex-shrink-0 space-y-2">
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                     <div className="w-64 flex-shrink-0 space-y-2">
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
  );

  const renderContent = () => {
    if (cards.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-8">
          You have no cards to compare. Add some cards to get started.
        </div>
      );
    }

    return (
        <Table className="min-w-full border-collapse">
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                    <TableHead className="w-48 sticky left-0 bg-background z-10">Feature</TableHead>
                    {cards.map(card => {
                        const bankLogo = getBankLogo(card.bankName);
                        return (
                            <TableHead key={card.id} className="w-64 min-w-64 text-center">
                                <div className="flex flex-col items-center gap-2">
                                     <div 
                                      className={cn("w-16 h-16 rounded-lg flex items-center justify-center", bankLogo ? "bg-card" : "")}
                                      style={!bankLogo ? { backgroundColor: card.color } : {}}
                                    >
                                        {bankLogo ? (
                                             <img src={bankLogo} alt={`${card.bankName} logo`} width="48" height="48" style={{ objectFit: 'contain' }} className="w-12 h-12" />
                                        ) : (
                                            <CreditCard className="w-10 h-10 text-white"/>
                                        )}
                                    </div>
                                    <p className="font-bold text-foreground">{card.cardName}</p>
                                    <p className="text-xs text-muted-foreground">{card.bankName}</p>
                                </div>
                            </TableHead>
                        )
                    })}
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium sticky left-0 bg-background z-10">Annual Fee</TableCell>
                    {cards.map(card => (
                        <TableCell key={card.id} className="text-center">{currency}{card.annualFee.toLocaleString()}</TableCell>
                    ))}
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium sticky left-0 bg-background z-10">Credit Limit</TableCell>
                    {cards.map(card => (
                        <TableCell key={card.id} className="text-center">
                            {card.creditLimit ? `${currency}${card.creditLimit.toLocaleString()}` : <span className="text-muted-foreground">N/A</span>}
                        </TableCell>
                    ))}
                </TableRow>
                 <TableRow>
                    <TableCell className="font-medium sticky left-0 bg-background z-10 align-top pt-4">Perks</TableCell>
                    {cards.map(card => (
                        <TableCell key={card.id} className="align-top">
                           {card.perks && card.perks.length > 0 ? (
                            <div className="flex flex-col items-center gap-1">
                                {card.perks.map(perk => <Badge key={perk} variant="secondary" className="text-center w-full justify-center truncate">{perk}</Badge>)}
                            </div>
                           ) : (
                            <span className="text-muted-foreground flex w-full justify-center">None</span>
                           )}
                        </TableCell>
                    ))}
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium sticky left-0 bg-background z-10 align-top pt-4">Spend Trackers</TableCell>
                     {cards.map(card => (
                        <TableCell key={card.id} className="align-top">
                           {card.spendTrackers && card.spendTrackers.length > 0 ? (
                             <div className="space-y-2">
                                {card.spendTrackers.map(tracker => (
                                    <div key={tracker.id} className="text-center text-xs p-2 rounded-md bg-muted/50">
                                        <p className="font-semibold text-muted-foreground">{tracker.name}</p>
                                        <p className="text-sm font-mono">{currency}{tracker.targetAmount.toLocaleString()} <span className="text-xs text-muted-foreground">({tracker.type})</span></p>
                                    </div>
                                ))}
                            </div>
                           ) : (
                            <span className="text-muted-foreground flex w-full justify-center">None</span>
                           )}
                        </TableCell>
                    ))}
                </TableRow>
                 <TableRow>
                    <TableCell className="font-medium sticky left-0 bg-background z-10 align-top pt-4">Fee Waiver</TableCell>
                    {cards.map(card => (
                        <TableCell key={card.id} className="text-center align-top">
                           {card.feeWaiverCriteria && card.feeWaiverCriteria !== 'N/A' ? card.feeWaiverCriteria : <span className="text-muted-foreground">N/A</span>}
                        </TableCell>
                    ))}
                </TableRow>
            </TableBody>
        </Table>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Card Comparison</h2>
      </div>

       {loading ? renderLoading() : (
            <Card>
                <CardHeader>
                    <CardTitle>Feature Comparison</CardTitle>
                    <CardDescription>A side-by-side comparison of your cards. Scroll horizontally to see all cards.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto relative">
                       {renderContent()}
                    </div>
                </CardContent>
            </Card>
       )}
    </div>
  );
}
