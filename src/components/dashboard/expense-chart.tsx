'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCards } from '@/contexts/card-context';
import { format } from 'date-fns';

export function ExpenseChart() {
  const { cards } = useCards();

  const monthlyData = cards.flatMap(card => 
      card.bills.map(bill => ({
          month: format(new Date(bill.dueDate), 'MMM'),
          [card.cardName]: bill.amount,
          fill: card.color
      }))
  ).reduce((acc, curr) => {
      const monthEntry = acc.find(item => item.month === curr.month);
      if (monthEntry) {
          const cardName = Object.keys(curr).find(k => k !== 'month' && k !== 'fill');
          if (cardName) {
            monthEntry[cardName] = (monthEntry[cardName] || 0) + curr[cardName];
          }
      } else {
          acc.push({ ...curr });
      }
      return acc;
  }, [] as any[]);

  const cardNames = cards.map(c => c.cardName);

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Monthly Spend</CardTitle>
        <CardDescription>Total expenses per card over the last months.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyData}>
                <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                    cursor={{fill: 'hsl(var(--card))'}}
                    contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                    }}
                />
                {cards.map((card) => (
                    <Bar key={card.id} dataKey={card.cardName} fill={card.color} radius={[4, 4, 0, 0]} stackId="a" />
                ))}
            </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
