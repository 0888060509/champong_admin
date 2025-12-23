

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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreateCollectionForm } from './create-collection-form';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { SuggestedCollection } from '@/ai/flows/suggest-product-collections';
import { CollectionSuggestionClient } from './collection-suggestion-client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCollections, type Collection, type CollectionCondition, type CollectionGroup } from './collections-context';


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
        if (!condition.conditions || condition.conditions.length === 0) return '()';
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
  const { 
    collections, 
    isFormOpen, 
    setFormOpen, 
    editingCollection, 
    handleSaveCollection,
    handleSuggestionClick,
    handleDuplicateCollection,
    deleteCollection,
    isSaving,
    openForm 
  } = useCollections();
  
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
                            <TableHead>Public Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Conditions</TableHead>
                            <TableHead className="text-right">Products</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {collections.map(collection => (
                        <TableRow key={collection.id}>
                            <TableCell className="font-medium">
                                <Link href={`/collections/${collection.id}`} className="hover:underline">
                                    {collection.name}
                                </Link>
                                <p className="text-xs text-muted-foreground">{collection.description}</p>
                            </TableCell>
                            <TableCell>{collection.publicTitle}</TableCell>
                            <TableCell>
                                <Badge variant={collection.isActive ? 'default' : 'secondary'}>
                                    {collection.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </TableCell>
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
                                        <Link href={`/collections/${collection.id}`} passHref><DropdownMenuItem>View Products</DropdownMenuItem></Link>
                                        <DropdownMenuItem onClick={() => openForm(collection)}>Edit</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDuplicateCollection(collection)}>Duplicate</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => deleteCollection(collection.id)} className="text-destructive">Delete</DropdownMenuItem>
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
                <DialogTitle>{editingCollection && editingCollection.id ? "Edit Collection" : "Create New Collection"}</DialogTitle>
                <DialogDescription>
                    {editingCollection && editingCollection.id ? "Modify the rules for this dynamic collection." : "Create a dynamic collection by defining rules and conditions."}
                </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] pr-6">
                    <CreateCollectionForm 
                        key={editingCollection?.id || editingCollection?.name}
                        onSave={handleSaveCollection} 
                        onCancel={() => setFormOpen(false)}
                        isSaving={isSaving}
                        initialData={editingCollection}
                    />
                </ScrollArea>
            </DialogContent>
        </Dialog>

        <CollectionSuggestionClient onSuggestionClick={handleSuggestionClick} />
    </div>
  );
}
