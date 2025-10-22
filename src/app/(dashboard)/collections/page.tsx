
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
    // This will be implemented in a future step
    console.log("Saving collection", data);
    toast({
        title: "Collection Created",
        description: `The collection has been successfully created.`,
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
                    Define a new product collection.
                </DialogDescription>
                </DialogHeader>
                <p className="text-center py-8">The form to create dynamic collections will be implemented here.</p>
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
