import { DUMMY_CARDS } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Edit } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BillsSection } from '@/components/cards/bills-section';
import { SpendTrackerSection } from '@/components/cards/spend-tracker-section';

export default function CardDetailPage({ params }: { params: { id: string } }) {
  const card = DUMMY_CARDS.find((c) => c.id === params.id);

  if (!card) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
            <div>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/cards">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Cards
                    </Link>
                </Button>
            </div>
            <div className="flex items-center space-x-2">
                <Button size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Card
                </Button>
            </div>
        </div>
      
        <Card>
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <div className="p-4 rounded-lg" style={{ backgroundColor: card.color }}>
                    <CreditCard className="w-8 h-8 text-white"/>
                </div>
                <div className="flex-grow">
                    <CardTitle className="text-2xl font-headline">{card.cardName}</CardTitle>
                    <CardDescription>{card.bankName} •••• {card.last4Digits}</CardDescription>
                     <div className="mt-2 flex flex-wrap gap-2">
                        {card.perks.map(perk => <Badge key={perk} variant="secondary">{perk}</Badge>)}
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-muted-foreground">Annual Fee</p>
                    <p className="text-lg font-bold">${card.annualFee}</p>
                </div>
            </CardHeader>
        </Card>

        <Tabs defaultValue="bills" className="space-y-4">
            <TabsList>
                <TabsTrigger value="bills">Bills</TabsTrigger>
                <TabsTrigger value="trackers">Spend Trackers</TabsTrigger>
            </TabsList>
            <TabsContent value="bills" className="space-y-4">
                <BillsSection bills={card.bills} />
            </TabsContent>
            <TabsContent value="trackers" className="space-y-4">
                <SpendTrackerSection trackers={card.spendTrackers} />
            </TabsContent>
        </Tabs>

    </div>
  );
}
