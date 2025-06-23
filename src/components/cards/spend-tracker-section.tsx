'use client'

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { type SpendTracker, type Bill } from "@/lib/types";
import { useCards } from '@/contexts/card-context';
import { AddEditSpendTrackerDialog, type SpendTrackerFormValues } from './add-edit-spend-tracker-dialog';
import { SpendTrackerItem } from './spend-tracker-item';

interface SpendTrackerSectionProps {
    cardId: string;
    trackers: SpendTracker[];
    bills: Bill[];
}

export function SpendTrackerSection({ cardId, trackers, bills }: SpendTrackerSectionProps) {
    const { addSpendTracker, updateSpendTracker, deleteSpendTracker } = useCards();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTracker, setEditingTracker] = useState<SpendTracker | undefined>(undefined);

    const handleSaveTracker = (data: SpendTrackerFormValues & { id?: string }) => {
        const { id, ...trackerData } = data;
        if (id) {
            updateSpendTracker(cardId, id, trackerData);
        } else {
            addSpendTracker(cardId, trackerData);
        }
        setEditingTracker(undefined);
        setIsDialogOpen(false);
    };
    
    const openEditDialog = (tracker: SpendTracker) => {
        setEditingTracker(tracker);
        setIsDialogOpen(true);
    }
    
    const openAddDialog = () => {
        setEditingTracker(undefined);
        setIsDialogOpen(true);
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Spend Trackers</CardTitle>
                        <CardDescription>Track your progress towards rewards and fee waivers.</CardDescription>
                    </div>
                    <Button size="sm" onClick={openAddDialog}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Tracker
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    {trackers.length > 0 ? trackers.map((tracker) => (
                        <SpendTrackerItem
                            key={tracker.id}
                            tracker={tracker}
                            bills={bills}
                            onEdit={() => openEditDialog(tracker)}
                            onDelete={() => deleteSpendTracker(cardId, tracker.id)}
                        />
                    )) : (
                        <div className="text-center text-muted-foreground py-4">
                            No spend trackers set up for this card.
                        </div>
                    )}
                </CardContent>
            </Card>

            <AddEditSpendTrackerDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSave={handleSaveTracker}
                tracker={editingTracker}
            />
        </>
    );
}
