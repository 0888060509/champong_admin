
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
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
import type { MenuItem, OptionGroup, MenuOption } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2, GripVertical } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const menuOptionSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Option name is required."),
    priceAdjustment: z.coerce.number(),
});

const optionGroupSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Group name is required."),
    type: z.enum(['single', 'multiple']),
    options: z.array(menuOptionSchema)
});

const itemFormSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  category: z.string().min(1, 'Please select a category.'),
  description: z.string().optional(),
  imageUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  isActive: z.boolean(),
  optionGroups: z.array(optionGroupSchema).optional(),
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
      optionGroups: initialData?.optionGroups ? JSON.parse(JSON.stringify(initialData.optionGroups)) : [],
    },
  });

  const { control, setValue } = form;

  const { fields: groupFields, append: appendGroup, remove: removeGroup } = useFieldArray({
      control,
      name: "optionGroups"
  });

  const handleAddGroupFromTemplate = (templateId: string) => {
    const template = allOptionGroups.find(g => g.id === templateId);
    if (template) {
        appendGroup({
            id: `new_group_${Date.now()}`,
            ...JSON.parse(JSON.stringify(template)) // Deep copy to allow independent editing
        });
    }
  };

  const handleAddNewCustomGroup = () => {
    appendGroup({
        id: `custom_group_${Date.now()}`,
        name: 'New Custom Group',
        type: 'single',
        options: [{ id: `custom_opt_${Date.now()}`, name: 'New Option', priceAdjustment: 0 }]
    });
  }

  const availableTemplates = allOptionGroups.filter(
    template => !groupFields.some(field => field.name === template.name)
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6 p-1">
        {/* Basic Info */}
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
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <Separator/>

        {/* Pricing and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField
                control={control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Base Price</FormLabel>
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
        
        {/* Option Groups Section */}
        <div>
          <h3 className="text-lg font-medium font-headline">Product Options</h3>
          <FormDescription>Customize options for this product.</FormDescription>
          
          <div className="space-y-4 mt-4">
            {groupFields.map((group, groupIndex) => (
                <OptionGroupCard 
                    key={group.id} 
                    groupIndex={groupIndex} 
                    onRemoveGroup={() => removeGroup(groupIndex)}
                />
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <Select onValueChange={handleAddGroupFromTemplate} value="">
                <SelectTrigger>
                    <SelectValue placeholder="Add options from a template..." />
                </SelectTrigger>
                <SelectContent>
                    {availableTemplates.length > 0 ? availableTemplates.map(template => (
                        <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                    )) : (
                        <SelectItem value="none" disabled>No available templates</SelectItem>
                    )}
                </SelectContent>
            </Select>
            <Button type="button" variant="outline" onClick={handleAddNewCustomGroup}>
                <PlusCircle className="mr-2 h-4 w-4" /> Custom Group
            </Button>
          </div>
        </div>

        {/* Status */}
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
        
        {/* Actions */}
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


// Inner component for managing a single option group within the product form
function OptionGroupCard({ groupIndex, onRemoveGroup }: { groupIndex: number, onRemoveGroup: () => void }) {
    const { control } = useForm<ItemFormValues>(); // Note: This should ideally come from useFormContext if nested properly

    const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({
        control,
        name: `optionGroups.${groupIndex}.options`
    });

    return (
        <Card className="bg-muted/30">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                     <FormField
                        control={control}
                        name={`optionGroups.${groupIndex}.name`}
                        render={({ field }) => (
                           <FormItem className="flex-1">
                               <FormControl>
                                   <Input {...field} className="text-base font-semibold font-headline tracking-tight" />
                               </FormControl>
                               <FormMessage />
                           </FormItem>
                        )}
                    />
                    <Button variant="ghost" size="icon" onClick={onRemoveGroup} className="ml-2">
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
                 <FormField
                    control={control}
                    name={`optionGroups.${groupIndex}.type`}
                    render={({ field }) => (
                        <FormItem>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-8 w-[180px]">
                                        <SelectValue placeholder="Selection type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="single">Single Choice</SelectItem>
                                    <SelectItem value="multiple">Multiple Choice</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />
            </CardHeader>
            <CardContent className="space-y-3">
                {optionFields.map((option, optionIndex) => (
                     <div key={option.id} className="flex items-center gap-2">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                        <FormField
                            control={control}
                            name={`optionGroups.${groupIndex}.options.${optionIndex}.name`}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl><Input placeholder="Option name" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={control}
                            name={`optionGroups.${groupIndex}.options.${optionIndex}.priceAdjustment`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">+ $</span>
                                            <Input type="number" step="0.01" className="pl-8 w-28" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(optionIndex)}>
                            <Trash2 className="h-4 w-4 text-destructive/70" />
                        </Button>
                    </div>
                ))}
                <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => appendOption({ id: `new_opt_${Date.now()}`, name: '', priceAdjustment: 0 })}
                >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Option
                </Button>
            </CardContent>
        </Card>
    );
}
