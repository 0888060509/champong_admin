

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ItemForm } from '../item-form';
import { mockOptionGroups, mockMenuItems } from '@/lib/mock-data';
import { useEffect, useState } from 'react';
import type { MenuItem } from '@/lib/types';

export default function NewMenuItemPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [initialData, setInitialData] = useState<MenuItem | null>(null);
  const [pageTitle, setPageTitle] = useState('Create New Menu Item');
  const [pageDescription, setPageDescription] = useState('Fill in the details for your new product.');

  useEffect(() => {
    const duplicateId = searchParams.get('duplicateId');
    if (duplicateId) {
        const itemToDuplicate = mockMenuItems.find(i => i.id === duplicateId);
        if (itemToDuplicate) {
            const duplicatedData = {
                ...JSON.parse(JSON.stringify(itemToDuplicate)), // Deep copy
                name: `Copy of ${itemToDuplicate.name}`,
                id: '', // Ensure it's treated as a new item
            };
            setInitialData(duplicatedData as MenuItem);
            setPageTitle(`Duplicate: ${itemToDuplicate.name}`);
            setPageDescription('Modify the details for your new duplicated product.');
        }
    }
  }, [searchParams]);

  const handleSaveItem = (itemData: any) => {
    console.log('Saving new item:', itemData);
    // In a real app, you would send this to your backend
    mockMenuItems.unshift({ id: `M${Date.now()}`, ...itemData });
    toast({ title: 'Success', description: 'New menu item created.' });
    router.push('/dashboard/menu');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-headline">{pageTitle}</h1>
          <p className="text-muted-foreground">{pageDescription}</p>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <ItemForm
            key={initialData ? `duplicate-${searchParams.get('duplicateId')}` : 'new'}
            onSave={handleSaveItem}
            onCancel={() => router.push('/dashboard/menu')}
            initialData={initialData}
            allOptionGroups={mockOptionGroups}
          />
        </CardContent>
      </Card>
    </div>
  );
}

    