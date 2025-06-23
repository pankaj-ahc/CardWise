'use client';

import { useState } from 'react';
import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCards } from '@/contexts/card-context';
import { format } from 'date-fns';
import { useSettings } from '@/contexts/settings-context';

export function ExpenseChart() {
  const { cards } = useCards();
  const { currency } = useSettings();
  const [hiddenCards, setHiddenCards] = useState<Record<string, boolean>>({});

  const handleLegendClick = (data: any) => {
    const { dataKey } = data;
    if (dataKey) {
        setHiddenCards(prev => ({
            ...prev,
            [dataKey]: !prev[dataKey],
        }));
    }
  };

  const monthlyTotals = cards.flatMap(card => 
      card.bills.map(bill => ({
          // Use 'yyyy-MM' for sorting, and create a label 'MMM yy'
          monthKey: format(new Date(bill.dueDate), 'yyyy-MM'),
          monthLabel: format(new Date(bill.dueDate), 'MMM yy'),
          cardName: card.cardName,
          amount: bill.amount,
          color: card.color
      }))
  ).reduce((acc, { monthKey, monthLabel, cardName, amount }) => {
      if (!acc[monthKey]) {
          acc[monthKey] = { month: monthLabel, monthKey: monthKey };
      }
      acc[monthKey][cardName] = (acc[monthKey][cardName] || 0) + amount;
      return acc;
  }, {} as Record<string, any>);

  const monthlyData = Object.values(monthlyTotals).sort((a, b) => a.monthKey.localeCompare(b.monthKey));
  
  // Custom formatter for the legend. This will apply styles to inactive items.
  const formatLegend = (value: string) => {
    const isHidden = hiddenCards[value];
    const style = {
      color: isHidden ? '#A0A0A0' : 'inherit',
      textDecoration: isHidden ? 'line-through' : 'none',
      cursor: 'pointer'
    };
    return <span style={style}>{value}</span>;
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Monthly Spend</CardTitle>
        <CardDescription>Total expenses per card over the last months. Click a card in the legend to toggle visibility.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
                    tickFormatter={(value) => `${currency}${value}`}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                    }}
                />
                <Legend onClick={handleLegendClick} formatter={formatLegend} />
                {cards.map((card) => (
                    !hiddenCards[card.cardName] && <Line 
                        key={card.id} 
                        type="monotone" 
                        dataKey={card.cardName} 
                        stroke={card.color}
                        strokeWidth={2}
                        dot={{ r: 4, fill: card.color, stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: card.color, stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
