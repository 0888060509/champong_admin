
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
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreateCollectionForm } from './create-collection-form';

type Collection = {
  id: string;
  name: string;
  productCount: number;
  type: 'Manual' | 'Dynamic';
};

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([
    { id: '1', name: 'Best Sellers', productCount: 5, type: 'Dynamic' },
    { id: '2', name: 'New Arrivals', productCount: 8, type: 'Dynamic' },
    { id: '3', name: 'Weekend Specials', productCount: 4, type: 'Manual' },
  ]);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveCollection = async (data: any) => {
    setIsSaving(true);
    console.log("Saving collection", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setCollections(prev => [...prev, {
        id: String(Date.now()),
        name: data.name,
        productCount: Math.floor(Math.random() * 20), // Mock customer count
        type: 'Dynamic'
    }]);

    setIsSaving(false);
    setCreateDialogOpen(false);
    toast({
        title: "Collection Created",
        description: `The collection "${data.name}" has been successfully created.`,
    });
  }
  
  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
            <CardTitle className="font-headline">Product Collections</CardTitle>
            <CardDescription>Group products for strategic merchandising on the user-facing app.</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Create Collection
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                <DialogTitle>Create New Collection</DialogTitle>
                <DialogDescription>
                    Create a dynamic collection by defining rules and conditions.
                </DialogDescription>
                </DialogHeader>
                 <CreateCollectionForm 
                    onSave={handleSaveCollection} 
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
                        <TableHead>Collection Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {collections.map(collection => (
                    <TableRow key={collection.id}>
                        <TableCell className="font-medium">{collection.name}</TableCell>
                        <TableCell>{collection.type}</TableCell>
                        <TableCell>{collection.productCount}</TableCell>
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
