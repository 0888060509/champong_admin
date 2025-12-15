
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
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
import type { MenuItem, OptionGroup } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const itemFormSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  category: z.string().min(1, 'Please select a category.'),
  description: z.string().optional(),
  imageUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  isActive: z.boolean(),
  optionGroups: z.array(z.any()).optional(),
});

type ItemFormValues = z.infer<typeof itemFormSchema>;

interface CreateItemFormProps {
  onSave: (data: ItemFormValues) => void;
  onCancel: () => void;
  initialData: MenuItem | null;
  allOptionGroups: OptionGroup[];
}

export function CreateItemForm({ onSave, onCancel, initialData, allOptionGroups }: CreateItemFormProps) {
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      price: initialData?.price || 0,
      category: initialData?.category || '',
      description: initialData?.description || '',
      imageUrl: initialData?.imageUrl || '',
      isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
      optionGroups: initialData?.optionGroups || [],
    },
  });

  const { control, setValue, watch } = form;
  const selectedOptionGroups = watch('optionGroups') || [];

  const handleAddOptionGroup = (groupId: string) => {
    const groupToAdd = allOptionGroups.find(g => g.id === groupId);
    if (groupToAdd && !selectedOptionGroups.some(g => g.id === groupId)) {
      setValue('optionGroups', [...selectedOptionGroups, groupToAdd]);
    }
  };

  const handleRemoveOptionGroup = (groupId: string) => {
    setValue('optionGroups', selectedOptionGroups.filter(g => g.id !== groupId));
  };
  
  const availableOptionGroups = allOptionGroups.filter(
      (group) => !selectedOptionGroups.some((selected) => selected.id === group.id)
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6 p-1">
        <div className="space-y-4">
            <FormField
              control={control}
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
              control={control}
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
              control={control}
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
                control={control}
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
                control={control}
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
        
        <Separator />
        
        <div>
          <FormLabel>Product Options</FormLabel>
          <FormDescription>Attach pre-defined option groups to this product.</FormDescription>
          <div className="mt-4 space-y-4">
             <Select onValueChange={handleAddOptionGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Add an option group..." />
                </SelectTrigger>
                <SelectContent>
                  {availableOptionGroups.map(group => (
                    <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2">
                {selectedOptionGroups.map(group => (
                   <Badge key={group.id} variant="secondary" className="flex items-center gap-1 text-sm">
                      {group.name}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveOptionGroup(group.id)} 
                        className="ml-1 rounded-full hover:bg-destructive/20 text-destructive"
                        >
                          <X className="h-3 w-3" />
                      </button>
                  </Badge>
                ))}
              </div>
          </div>
        </div>

        <FormField
            control={control}
            name="isActive"
            render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-6">
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
