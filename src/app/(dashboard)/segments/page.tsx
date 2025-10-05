
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateSegmentForm } from './create-segment-form';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Segment = {
  id: string;
  name: string;
  customers: number;
};

export default function SegmentsPage() {
  const [segments, setSegments] = useState<Segment[]>([
    { id: '1', name: 'High Spenders', customers: 42 },
    { id: '2', name: 'Recent Visitors', customers: 128 },
    { id: '3', name: 'Lapsed Customers', customers: 19 },
  ]);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveSegment = async (data: any) => {
    setIsSaving(true);
    console.log("Saving segment", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSegments(prev => [...prev, {
        id: String(Date.now()),
        name: data.name,
        customers: Math.floor(Math.random() * 200) // Mock customer count
    }]);

    setIsSaving(false);
    setCreateDialogOpen(false);
    toast({
        title: "Segment Created",
        description: `The segment "${data.name}" has been successfully created.`,
    });
  }
  
  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
            <CardTitle className="font-headline">Customer Segments</CardTitle>
            <CardDescription>Create and manage your customer segments.</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Create Segment
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                <DialogTitle>Create New Segment</DialogTitle>
                <DialogDescription>
                    Define a new customer segment by adding conditions.
                </DialogDescription>
                </DialogHeader>
                <CreateSegmentForm 
                onSave={handleSaveSegment} 
                onCancel={() => setCreateDialogOpen(false)}
                isSaving={isSaving}
                />
            </DialogContent>
            </Dialog>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Segment Name</TableHead>
                        <TableHead>Customers</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {segments.map(segment => (
                    <TableRow key={segment.id}>
                        <TableCell className="font-medium">{segment.name}</TableCell>
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
  );
}
