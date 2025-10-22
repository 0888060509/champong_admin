
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
import { Badge } from '@/components/ui/badge';
import { SegmentationClient } from '../segments/segmentation-client';

type CollectionCondition = {
  type: 'condition';
  criteria: string;
  operator: string;
  value: any;
};

type CollectionGroup = {
    type: 'group';
    logic: 'AND' | 'OR';
    conditions: (CollectionCondition | CollectionGroup)[];
};

type Collection = {
  id: string;
  name: string;
  productCount: number;
  rules: CollectionGroup;
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
      productCount: 12, 
      rules: { type: 'group', logic: 'AND', conditions: [{type: 'condition', criteria: 'profit_margin', operator: 'gte', value: 40}]}
    },
    { 
      id: '2', 
      name: 'Low Stock Specials', 
      productCount: 8, 
      rules: { type: 'group', logic: 'AND', conditions: [{type: 'condition', criteria: 'stock_level', operator: 'lte', value: 10}]}
    },
    { 
      id: '3', 
      name: 'Weekend Dessert Specials', 
      productCount: 4, 
      rules: { 
          type: 'group',
          logic: 'OR', 
          conditions: [
              {type: 'condition', criteria: 'tags', operator: 'contains', value: 'special'},
              {type: 'condition', criteria: 'category', operator: 'eq', value: 'Desserts'}
          ]
      }
    },
     { 
      id: '4', 
      name: 'Premium Main Courses', 
      productCount: 7, 
      rules: { 
          type: 'group',
          logic: 'AND', 
          conditions: [
              {type: 'condition', criteria: 'category', operator: 'eq', value: 'Main Course'},
              {type: 'condition', criteria: 'price', operator: 'gte', value: 25}
          ]
      }
    },
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
        rules: data.root,
    }]);

    setIsSaving(false);
    setCreateDialogOpen(false);
    toast({
        title: "Collection Created",
        description: `The collection "${data.name}" has been successfully created.`,
    });
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
                                <Badge variant="outline" className="font-mono text-xs">{formatCondition(collection.rules)}</Badge>
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
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
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

        <SegmentationClient />
    </div>
  );
}
