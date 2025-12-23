


'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ItemForm } from '../../item-form';
import { mockOptionGroups, mockMenuItems } from '@/lib/mock-data';
import type { MenuItem } from '@/lib/types';

export default function EditMenuItemPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [item, setItem] = useState<MenuItem | null>(null);

  const itemId = params.id as string;

  useEffect(() => {
    const foundItem = mockMenuItems.find(i => i.id === itemId);
    if (foundItem) {
      setItem(foundItem);
    } else {
      toast({ title: 'Error', description: 'Menu item not found.', variant: 'destructive' });
      router.push('/dashboard/menu');
    }
  }, [itemId, router, toast]);

  const handleSaveItem = (itemData: any) => {
    console.log('Updating item:', itemData);
    // In a real app, you would send this to your backend
    const itemIndex = mockMenuItems.findIndex(i => i.id === itemId);
    if (itemIndex > -1) {
        mockMenuItems[itemIndex] = { ...mockMenuItems[itemIndex], ...itemData, id: itemId };
    }
    
    toast({ title: 'Success', description: 'Menu item updated.' });
    router.push('/dashboard/menu');
  };

  if (!item) {
      return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-headline">Edit: {item.name}</h1>
          <p className="text-muted-foreground">Make changes to your product details and options.</p>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <ItemForm
            onSave={handleSaveItem}
            onCancel={() => router.push('/dashboard/menu')}
            initialData={item}
            allOptionGroups={mockOptionGroups}
          />
        </CardContent>
      </Card>
    </div>
  );
}

    