
'use client';

import { useState } from 'react';
import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCards } from '@/contexts/card-context';
import { format } from 'date-fns';
import { useSettings } from '@/contexts/settings-context';

const chartColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
];

const CustomTooltip = ({ active, payload, label, currency }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum, item) => sum + item.value, 0);

    return (
      <div className="rounded-lg border bg-popover p-2.5 text-popover-foreground shadow-sm min-w-[12rem]">
        <p className="font-bold mb-2 text-center">{label}</p>
        <div className="space-y-1">
          {payload.map((pld: any) => (
            <div key={pld.dataKey} className="flex items-center justify-between gap-4">
              <div className="flex items-center">
                <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: pld.color }}></span>
                <span className="text-muted-foreground text-sm">{pld.name}</span>
              </div>
              <span className="font-semibold text-sm">{currency}{pld.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          ))}
        </div>
        {(payload.length > 1) && (
          <>
            <div className="border-t my-2" />
            <div className="flex items-center justify-between font-bold text-sm">
              <span>Total</span>
              <span>{currency}{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </>
        )}
      </div>
    );
  }

  return null;
};


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
      card.bills
      .filter(bill => bill.amount > 0)
      .map(bill => ({
          monthKey: format(new Date(bill.dueDate), 'yyyy-MM'),
          monthLabel: format(new Date(bill.dueDate), 'MMM yy'),
          cardId: card.id,
          amount: bill.amount
      }))
  ).reduce((acc, { monthKey, monthLabel, cardId, amount }) => {
      if (!acc[monthKey]) {
          acc[monthKey] = { month: monthLabel, monthKey: monthKey };
      }
      acc[monthKey][cardId] = (acc[monthKey][cardId] || 0) + amount;
      return acc;
  }, {} as Record<string, any>);

  const monthlyData = Object.values(monthlyTotals).sort((a, b) => a.monthKey.localeCompare(b.monthKey));
  
  // Custom formatter for the legend. This will apply styles to inactive items.
  const formatLegend = (value: string, entry: any) => {
    const { dataKey } = entry;
    const isHidden = hiddenCards[dataKey];
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
                    tickFormatter={(value) => `${currency}${Math.round(value as number)}`}
                />
                <Tooltip
                    content={<CustomTooltip currency={currency} />}
                    cursor={{ fill: 'hsl(var(--muted))' }}
                />
                <Legend onClick={handleLegendClick} formatter={formatLegend} />
                {cards.map((card, index) => {
                    const color = chartColors[index % chartColors.length];
                    return (
                        <Line 
                            key={card.id} 
                            type="monotone" 
                            dataKey={card.id} 
                            name={card.cardName}
                            stroke={color}
                            strokeWidth={2}
                            dot={{ r: 4, fill: color, stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: color, stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                            hide={!!hiddenCards[card.id]}
                        />
                    )
                })}
            </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
