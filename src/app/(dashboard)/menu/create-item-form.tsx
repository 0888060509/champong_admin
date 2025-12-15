
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { MenuItem } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

const itemFormSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  category: z.string().min(1, 'Please select a category.'),
  description: z.string().optional(),
  imageUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  isActive: z.boolean(),
});

type ItemFormValues = z.infer<typeof itemFormSchema>;

interface CreateItemFormProps {
  onSave: (data: ItemFormValues) => void;
  onCancel: () => void;
  initialData: MenuItem | null;
}

export function CreateItemForm({ onSave, onCancel, initialData }: CreateItemFormProps) {
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      price: initialData?.price || 0,
      category: initialData?.category || '',
      description: initialData?.description || '',
      imageUrl: initialData?.imageUrl || '',
      isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6 p-1">
        <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Classic Burger" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A short, appealing description for customers." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://picsum.photos/seed/..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide a link to the product image.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <Separator/>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                        <Input type="number" step="0.01" placeholder="9.99" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
             />
             <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Main Course">Main Course</SelectItem>
                                <SelectItem value="Appetizers">Appetizers</SelectItem>
                                <SelectItem value="Desserts">Desserts</SelectItem>
                                <SelectItem value="Drinks">Drinks</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <FormLabel>Status</FormLabel>
                    <FormDescription>
                    Inactive products will not be visible to customers.
                    </FormDescription>
                </div>
                <FormControl>
                    <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    />
                </FormControl>
                </FormItem>
            )}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit">
            {initialData ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
