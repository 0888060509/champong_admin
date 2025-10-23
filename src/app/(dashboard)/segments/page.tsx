
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateSegmentForm, segmentFormSchema } from './create-segment-form';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SegmentationClient } from './segmentation-client';
import type { SuggestedSegment } from '@/ai/flows/suggest-customer-segments-with-rules';
import type { z } from 'zod';
import { ScrollArea } from '@/components/ui/scroll-area';

export type Condition = {
  id?: string;
  type: 'condition';
  criteria: string;
  operator: string;
  value: any;
};

export type ConditionGroup = {
    id?: string;
    type: 'group';
    logic: 'AND' | 'OR';
    conditions: (Condition | ConditionGroup)[];
};

export type Segment = {
  id: string;
  name: string;
  description?: string;
  customers: number;
  root?: ConditionGroup;
};

export default function SegmentsPage() {
  const [segments, setSegments] = useState<Segment[]>([
    { id: '1', name: 'High Spenders', customers: 42, description: 'Customers who have spent a significant amount.' },
    { id: '2', name: 'Recent Visitors', customers: 128, description: 'Customers who have visited in the last 30 days.' },
    { id: '3', name: 'Lapsed Customers', customers: 19, description: 'Customers who have not visited in the last 90 days.' },
  ]);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [initialSegmentData, setInitialSegmentData] = useState<Partial<Segment> | null>(null);

  const handleSaveSegment = async (data: z.infer<typeof segmentFormSchema>) => {
    setIsSaving(true);
    console.log("Saving segment", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSegments(prev => [...prev, {
        id: String(Date.now()),
        name: data.name,
        description: data.description,
        customers: Math.floor(Math.random() * 200), // Mock customer count
        root: data.root,
    }]);

    setIsSaving(false);
    setCreateDialogOpen(false);
    setInitialSegmentData(null);
    toast({
        title: "Segment Created",
        description: `The segment "${data.name}" has been successfully created.`,
    });
  }

  const openCreateDialog = (data: Partial<Segment> | null = null) => {
    setInitialSegmentData(data);
    setCreateDialogOpen(true);
  }
  
  const handleSuggestionClick = (suggestion: SuggestedSegment) => {
    const segmentData = {
      name: suggestion.name,
      description: suggestion.description,
      root: suggestion.suggestedConditions,
    };
    openCreateDialog(segmentData);
  };

  return (
    <div className="space-y-6">
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
            <CardTitle className="font-headline">Customer Segments</CardTitle>
            <CardDescription>Create and manage your customer segments.</CardDescription>
            </div>
            <Button onClick={() => openCreateDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create Segment
            </Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Segment Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Customers</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {segments.map(segment => (
                    <TableRow key={segment.id}>
                        <TableCell className="font-medium">{segment.name}</TableCell>
                        <TableCell className="text-muted-foreground">{segment.description}</TableCell>
                        <TableCell>{segment.customers}</TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>

    <Dialog open={isCreateDialogOpen} onOpenChange={(isOpen) => {
      setCreateDialogOpen(isOpen);
      if (!isOpen) {
        setInitialSegmentData(null);
      }
    }}>
      <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
          <DialogTitle>Create New Segment</DialogTitle>
          <DialogDescription>
              Define a new customer segment by adding conditions.
          </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-6">
            <CreateSegmentForm 
              key={initialSegmentData ? initialSegmentData.name : 'new'}
              initialData={initialSegmentData}
              onSave={handleSaveSegment} 
              onCancel={() => setCreateDialogOpen(false)}
              isSaving={isSaving}
            />
          </ScrollArea>
      </DialogContent>
    </Dialog>

    <SegmentationClient onSuggestionClick={handleSuggestionClick} />

    </div>
  );
}
