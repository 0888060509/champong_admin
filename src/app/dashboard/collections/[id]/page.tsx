
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import type { Collection, CollectionCondition, CollectionGroup } from '../collections-context';
import { mockMenuItems } from '@/lib/mock-data';
import type { MenuItem } from '@/lib/types';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useCollections } from '../collections-context';

// Helper function from collections/page.tsx - ideally this would be in a shared lib
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


export default function CollectionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const collectionId = params.id as string;
    
    const { getCollectionById, openForm, deleteCollection } = useCollections();
    const [collection, setCollection] = useState<Collection | null>(null);
    const [products, setProducts] = useState<MenuItem[]>([]);
    
    useEffect(() => {
        if (collectionId) {
            const foundCollection = getCollectionById(collectionId);
            if (!foundCollection) {
                router.push('/dashboard/collections');
                return;
            }
            setCollection(foundCollection);

            // Simulate fetching products for this collection
            // Here we just shuffle and take a few mock items
            const shuffled = [...mockMenuItems].sort(() => 0.5 - Math.random());
            setProducts(shuffled.slice(0, foundCollection.productCount));
        }
    }, [collectionId, getCollectionById, router]);
    
    const handleDelete = () => {
        if (collection) {
            deleteCollection(collection.id);
            router.push('/dashboard/collections');
        }
    }

    if (!collection) {
        return <div>Loading collection...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.push('/dashboard/collections')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <CardTitle className="font-headline text-2xl">{collection.publicTitle || collection.name}</CardTitle>
                        <CardDescription>{collection.publicSubtitle || collection.description}</CardDescription>
                    </div>
                </div>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openForm(collection)}>Edit Collection</DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDelete} className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Collection Rules</CardTitle>
                    <CardDescription>
                        Products are automatically added to this collection if they match the following rules.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Badge variant="outline" className="font-mono text-sm p-2">{formatCondition(collection.root)}</Badge>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Products in this Collection ({products.length})</CardTitle>
                     <CardDescription>
                        A preview of the products currently matching the collection rules.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">Image</TableHead>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map(item => (
                                <TableRow key={item.id}>
                                     <TableCell>
                                        <Image
                                            src={`https://picsum.photos/seed/${item.id}/64/64`}
                                            alt={item.name}
                                            width={64}
                                            height={64}
                                            className="rounded-md object-cover"
                                            data-ai-hint="food item"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

    