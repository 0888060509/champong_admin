

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, FormProvider, useFormContext } from 'react-hook-form';
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
import { PlusCircle, Trash2, GripVertical, X, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockMenuItems } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Image from 'next/image';

const menuOptionSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Option name is required."),
    priceAdjustment: z.coerce.number(),
});

const optionGroupSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Group name is required."),
    type: z.enum(['single', 'multiple']),
    required: z.boolean().default(false),
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
  crossSellProductIds: z.array(z.string()).optional(),
});

type ItemFormValues = z.infer<typeof itemFormSchema>;

interface ItemFormProps {
  onSave: (data: ItemFormValues) => void;
  onCancel: () => void;
  initialData: MenuItem | null;
  allOptionGroups: OptionGroup[];
}

export function ItemForm({ onSave, onCancel, initialData, allOptionGroups }: ItemFormProps) {
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
      crossSellProductIds: initialData?.crossSellProductIds || [],
    },
  });

  const { control, watch } = form;

  const { fields: groupFields, append: appendGroup, remove: removeGroup, move: moveGroup } = useFieldArray({
      control,
      name: "optionGroups"
  });
  
  const { fields: crossSellFields, append: appendCrossSell, remove: removeCrossSell } = useFieldArray({
    control,
    name: "crossSellProductIds"
  });
  
  const watchedCrossSellIds = watch('crossSellProductIds') || [];

  const handleAddGroupFromTemplate = (templateId: string) => {
    const template = allOptionGroups.find(g => g.id === templateId);
    if (template) {
        appendGroup({
            id: `new_group_${Date.now()}`,
            ...JSON.parse(JSON.stringify(template)), // Deep copy
            required: template.required ?? false,
        });
    }
  };

  const handleAddNewCustomGroup = () => {
    appendGroup({
        id: `custom_group_${Date.now()}`,
        name: 'New Custom Group',
        type: 'single',
        required: false,
        options: [{ id: `custom_opt_${Date.now()}`, name: 'New Option', priceAdjustment: 0 }]
    });
  }

  // Prevent already added groups from showing in the template list
  const existingGroupNames = watch('optionGroups')?.map(field => field.name) || [];
  const availableTemplates = allOptionGroups.filter(
    template => !existingGroupNames.includes(template.name)
  );
  
  const availableCrossSellProducts = mockMenuItems.filter(
    item => item.id !== initialData?.id && !watchedCrossSellIds.includes(item.id)
  );
  
  const selectedCrossSellProducts = watchedCrossSellIds.map(id => mockMenuItems.find(item => item.id === id)).filter(Boolean) as MenuItem[];


  return (
    <FormProvider {...form}>
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
            <FormDescription>Add and customize modifiers for this product, like sizes or toppings.</FormDescription>
            
            <div className="space-y-4 mt-4">
              {groupFields.map((group, groupIndex) => (
                  <OptionGroupCard 
                      key={group.id} 
                      groupIndex={groupIndex} 
                      onRemoveGroup={() => removeGroup(groupIndex)}
                      onMoveUp={() => groupIndex > 0 && moveGroup(groupIndex, groupIndex - 1)}
                      onMoveDown={() => groupIndex < groupFields.length - 1 && moveGroup(groupIndex, groupIndex + 1)}
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
          
          <Separator />
          
           {/* Cross-sell Section */}
          <div>
            <h3 className="text-lg font-medium font-headline">Cross-sell Items</h3>
            <FormDescription>Suggest other products to customers when they view this item.</FormDescription>
            
            <div className="mt-4">
               <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      Add items to suggest...
                      <PlusCircle className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Search products..." />
                       <CommandList>
                        <CommandEmpty>No products found.</CommandEmpty>
                        <CommandGroup>
                          {availableCrossSellProducts.map((item) => (
                            <CommandItem
                              key={item.id}
                              value={item.name}
                              onSelect={() => {
                                appendCrossSell(item.id);
                              }}
                              className="!p-2"
                            >
                               <div className="flex items-center gap-3">
                                <Image
                                  src={item.imageUrl || `https://picsum.photos/seed/${item.id}/64/64`}
                                  alt={item.name}
                                  width={40}
                                  height={40}
                                  className="rounded-md object-cover"
                                />
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">{item.category} &middot; ${item.price.toFixed(2)}</p>
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                 <div className="mt-4 flex flex-wrap gap-2">
                    {selectedCrossSellProducts.map((item, index) => (
                      <Badge key={item.id} variant="secondary" className="flex items-center gap-1">
                        {item.name}
                        <button
                          type="button"
                          className="ml-1 rounded-full hover:bg-destructive/20 text-destructive"
                          onClick={() => removeCrossSell(index)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>

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
              {initialData?.id ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}


// Inner component for managing a single option group within the product form
function OptionGroupCard({ 
    groupIndex, 
    onRemoveGroup,
    onMoveUp,
    onMoveDown,
}: { 
    groupIndex: number, 
    onRemoveGroup: () => void,
    onMoveUp: () => void,
    onMoveDown: () => void
}) {
    const { control } = useFormContext<ItemFormValues>();

    const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({
        control,
        name: `optionGroups.${groupIndex}.options`
    });

    return (
        <Card className="bg-muted/30 relative pl-12">
            <div className="absolute left-2 top-2 flex flex-col gap-1">
                <Button type="button" variant="ghost" size="icon" className="h-6 w-6 cursor-pointer" onClick={onMoveUp}>
                    <ArrowUp className="h-4 w-4" />
                </Button>
                 <GripVertical className="h-6 w-6 text-muted-foreground cursor-grab" />
                 <Button type="button" variant="ghost" size="icon" className="h-6 w-6 cursor-pointer" onClick={onMoveDown}>
                    <ArrowDown className="h-4 w-4" />
                </Button>
            </div>
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
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
                    <Button variant="ghost" size="icon" onClick={onRemoveGroup} className="ml-2 shrink-0">
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
                <div className="flex items-center justify-between gap-4 pt-2">
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
                    <FormField
                        control={control}
                        name={`optionGroups.${groupIndex}.required`}
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                <FormControl>
                                    <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                    Required
                                </FormLabel>
                            </FormItem>
                        )}
                        />
                </div>
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

    