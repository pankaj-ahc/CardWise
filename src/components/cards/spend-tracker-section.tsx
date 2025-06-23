'use client'

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, PlusCircle, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { type SpendTracker } from "@/lib/types";
import { useCards } from '@/contexts/card-context';
import { AddEditSpendTrackerDialog, type SpendTrackerFormValues } from './add-edit-spend-tracker-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';

interface SpendTrackerSectionProps {
    cardId: string;
    trackers: SpendTracker[];
}

export function SpendTrackerSection({ cardId, trackers }: SpendTrackerSectionProps) {
    const { addSpendTracker, updateSpendTracker, deleteSpendTracker } = useCards();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTracker, setEditingTracker] = useState<SpendTracker | undefined>(undefined);
    const [deletingTrackerId, setDeletingTrackerId] = useState<string | null>(null);

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

    const handleDeleteTracker = () => {
        if (deletingTrackerId) {
            deleteSpendTracker(cardId, deletingTrackerId);
            setDeletingTrackerId(null);
        }
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
                <CardContent className="space-y-6">
                    {trackers.length > 0 ? trackers.map((tracker) => (
                        <div key={tracker.id} className="group relative pt-4">
                            <div className="absolute top-0 right-0">
                                <AlertDialog>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal className="h-4 w-4"/>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openEditDialog(tracker)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <AlertDialogTrigger asChild>
                                                <DropdownMenuItem 
                                                    onSelect={(e) => { e.preventDefault(); setDeletingTrackerId(tracker.id); }}
                                                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </AlertDialogTrigger>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete this spend tracker.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel onClick={() => setDeletingTrackerId(null)}>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDeleteTracker} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>

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
                                <span>Start: {format(new Date(tracker.startDate), 'MMM dd, yyyy')}</span>
                                <span>End: {format(new Date(tracker.endDate), 'MMM dd, yyyy')}</span>
                            </div>
                        </div>
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
