
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
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreateCollectionForm } from './create-collection-form';
import { Badge } from '@/components/ui/badge';
import { SegmentationClient } from '../segments/segmentation-client';

export type CollectionCondition = {
  id?: string;
  type: 'condition';
  criteria: string;
  operator: string;
  value: any;
};

export type CollectionGroup = {
    id?: string;
    type: 'group';
    logic: 'AND' | 'OR';
    conditions: (CollectionCondition | CollectionGroup)[];
};

export type Collection = {
  id: string;
  name: string;
  description?: string;
  productCount: number;
  root: CollectionGroup;
};

const operatorMap: { [key: string]: string } = {
  eq: '=',
  neq: '!=',
  gte: '>=',
  lte: '<=',
  contains: 'contains',
};

const criteriaMap: { [key: string]: string } = {
    category: 'Category',
    price: 'Price',
    profit_margin: 'Profit Margin',
    stock_level: 'Stock Level',
    tags: 'Tags'
}


const formatCondition = (condition: CollectionCondition | CollectionGroup): string => {
    if (condition.type === 'group') {
        const nested = condition.conditions.map(formatCondition).join(` ${condition.logic} `);
        return `(${nested})`;
    }
    const { criteria, operator, value } = condition;
    const formattedCriteria = criteriaMap[criteria] || criteria;
    const formattedOperator = operatorMap[operator] || operator;
    const formattedValue = typeof value === 'string' ? `'${value}'` : value;

    return `${formattedCriteria} ${formattedOperator} ${formattedValue}`;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([
    { 
      id: '1', 
      name: 'High Profit Items', 
      description: 'Items with a high profit margin, great for upselling.',
      productCount: 12, 
      root: { type: 'group', logic: 'AND', conditions: [{type: 'condition', criteria: 'profit_margin', operator: 'gte', value: 40}]}
    },
    { 
      id: '2', 
      name: 'Low Stock Specials', 
      description: 'Clear out items that are low in stock.',
      productCount: 8, 
      root: { type: 'group', logic: 'AND', conditions: [{type: 'condition', criteria: 'stock_level', operator: 'lte', value: 10}]}
    },
    { 
      id: '3', 
      name: 'Weekend Dessert Specials', 
      description: 'Special desserts featured only on weekends.',
      productCount: 4, 
      root: { 
          type: 'group',
          logic: 'AND', 
          conditions: [
              {type: 'condition', criteria: 'tags', operator: 'contains', value: 'weekend_special'},
              {type: 'condition', criteria: 'category', operator: 'eq', value: 'Desserts'}
          ]
      }
    },
     { 
      id: '4', 
      name: 'Premium Main Courses', 
      productCount: 7, 
      root: { 
          type: 'group',
          logic: 'AND', 
          conditions: [
              {type: 'condition', criteria: 'category', operator: 'eq', value: 'Main Course'},
              {type: 'condition', criteria: 'price', operator: 'gte', value: 25}
          ]
      }
    },
  ]);
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const openForm = (collection: Collection | null = null) => {
    setEditingCollection(collection);
    setFormOpen(true);
  }

  const handleSaveCollection = async (data: any) => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (editingCollection) { // We are editing
        setCollections(prev => prev.map(c => c.id === editingCollection.id ? { ...c, ...data, root: data.root, description: data.description } : c));
        toast({
            title: "Collection Updated",
            description: `The collection "${data.name}" has been successfully updated.`,
        });
    } else { // We are creating
        setCollections(prev => [...prev, {
            id: String(Date.now()),
            name: data.name,
            description: data.description,
            productCount: Math.floor(Math.random() * 20), // Mock customer count
            root: data.root,
        }]);
        toast({
            title: "Collection Created",
            description: `The collection "${data.name}" has been successfully created.`,
        });
    }

    setIsSaving(false);
    setFormOpen(false);
    setEditingCollection(null);
  }

  const handleDeleteCollection = (collectionId: string) => {
    setCollections(prev => prev.filter(c => c.id !== collectionId));
    toast({
        title: "Collection Deleted",
        description: "The collection has been successfully deleted.",
        variant: "destructive"
    });
  }
  
  return (
    <div className="space-y-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                <CardTitle className="font-headline">Product Collections</CardTitle>
                <CardDescription>Group products for strategic merchandising on the user-facing app.</CardDescription>
                </div>
                <Button onClick={() => openForm()}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Collection
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Collection Name</TableHead>
                            <TableHead>Conditions</TableHead>
                            <TableHead className="text-right">Products</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {collections.map(collection => (
                        <TableRow key={collection.id}>
                            <TableCell className="font-medium">{collection.name}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className="font-mono text-xs">{formatCondition(collection.root)}</Badge>
                            </TableCell>
                            <TableCell className="text-right">{collection.productCount}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => openForm(collection)}>Edit</DropdownMenuItem>
                                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDeleteCollection(collection.id)} className="text-destructive">Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                <DialogTitle>{editingCollection ? "Edit Collection" : "Create New Collection"}</DialogTitle>
                <DialogDescription>
                    {editingCollection ? "Modify the rules for this dynamic collection." : "Create a dynamic collection by defining rules and conditions."}
                </DialogDescription>
                </DialogHeader>
                <CreateCollectionForm 
                    key={editingCollection?.id || 'new'}
                    onSave={handleSaveCollection} 
                    onCancel={() => setFormOpen(false)}
                    isSaving={isSaving}
                    initialData={editingCollection}
                />
            </DialogContent>
        </Dialog>

        <SegmentationClient />
    </div>
  );
}
