'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { type SpendTracker } from "@/lib/types";

interface SpendTrackerSectionProps {
    trackers: SpendTracker[];
}

export function SpendTrackerSection({ trackers }: SpendTrackerSectionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Spend Trackers</CardTitle>
                <CardDescription>Track your progress towards rewards and fee waivers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {trackers.length > 0 ? trackers.map((tracker) => (
                     <div key={tracker.id}>
                        <div className="flex justify-between items-end mb-1">
                            <div>
                                <p className="font-medium">{tracker.name}</p>
                                <p className="text-sm text-muted-foreground">{tracker.type}</p>
                            </div>
                            <p className="text-sm font-mono">
                                ${tracker.currentSpend.toLocaleString()} / ${tracker.targetAmount.toLocaleString()}
                            </p>
                        </div>
                        <Progress value={(tracker.currentSpend / tracker.targetAmount) * 100} />
                        <div className="flex justify-between items-end mt-1 text-xs text-muted-foreground">
                            <span>Start: {tracker.startDate}</span>
                            <span>End: {tracker.endDate}</span>
                        </div>
                    </div>
                )) : (
                    <div className="text-center text-muted-foreground py-4">
                        No spend trackers set up for this card.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
