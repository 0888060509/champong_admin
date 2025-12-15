
'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ItemForm } from '../item-form';
import { mockOptionGroups, mockMenuItems } from '@/lib/mock-data';

export default function NewMenuItemPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSaveItem = (itemData: any) => {
    console.log('Saving new item:', itemData);
    // In a real app, you would send this to your backend
    mockMenuItems.unshift({ id: `M${Date.now()}`, ...itemData });
    toast({ title: 'Success', description: 'New menu item created.' });
    router.push('/menu');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-headline">Create New Menu Item</h1>
          <p className="text-muted-foreground">Fill in the details for your new product.</p>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <ItemForm
            onSave={handleSaveItem}
            onCancel={() => router.push('/menu')}
            initialData={null}
            allOptionGroups={mockOptionGroups}
          />
        </CardContent>
      </Card>
    </div>
  );
}

    