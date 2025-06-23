'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DUMMY_CARDS } from '@/lib/data';

const monthlyData = DUMMY_CARDS.flatMap(card => 
    card.bills.map(bill => ({
        month: bill.month.split(' ')[0],
        [card.cardName]: bill.amount,
        fill: card.color
    }))
).reduce((acc, curr) => {
    const monthEntry = acc.find(item => item.month === curr.month);
    if (monthEntry) {
        Object.assign(monthEntry, { ...monthEntry, ...curr });
    } else {
        acc.push(curr);
    }
    return acc;
}, [] as any[]);

const cardNames = DUMMY_CARDS.map(c => c.cardName);

export function ExpenseChart() {
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
                {cardNames.map((name, index) => (
                    <Bar key={name} dataKey={name} fill={DUMMY_CARDS[index].color} radius={[4, 4, 0, 0]} />
                ))}
            </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
