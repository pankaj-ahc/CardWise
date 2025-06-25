'use client';

import { useTheme } from 'next-themes';
import { useSettings } from '@/contexts/settings-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sun, Moon, Laptop } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const currencies = [
  { value: '$', label: 'USD - US Dollar' },
  { value: '€', label: 'EUR - Euro' },
  { value: '£', label: 'GBP - British Pound' },
  { value: '¥', label: 'JPY - Japanese Yen' },
  { value: '₹', label: 'INR - Indian Rupee' },
  { value: 'A$', label: 'AUD - Australian Dollar' },
  { value: 'C$', label: 'CAD - Canadian Dollar' },
  { value: 'CHF', label: 'CHF - Swiss Franc' },
  { value: 'CN¥', label: 'CNY - Chinese Yuan' },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { currency, setCurrency } = useSettings();

  return (
    <div className="flex-1 space-y-4 p-4 pt-14 md:p-6 md:pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Settings</h2>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Theme</Label>
              <RadioGroup
                value={theme}
                onValueChange={setTheme}
                className="grid max-w-md grid-cols-1 sm:grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem value="light" id="light" className="peer sr-only" />
                  <Label
                    htmlFor="light"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Sun className="mb-2 h-6 w-6" />
                    Light
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                  <Label
                    htmlFor="dark"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Moon className="mb-2 h-6 w-6" />
                    Dark
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="system" id="system" className="peer sr-only" />
                  <Label
                    htmlFor="system"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Laptop className="mb-2 h-6 w-6" />
                    System
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="max-w-xs" id="currency">
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c.label} value={c.value}>
                       {c.label} ({c.value})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                This will be used to display monetary values across the app.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
