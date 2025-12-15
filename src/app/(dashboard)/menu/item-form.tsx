

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
import type { MenuItem, OptionGroup, CrossSellGroup, ComboProduct } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2, GripVertical, X, ArrowUp, ArrowDown, StickyNote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockMenuItems, mockBundleTemplates } from '@/lib/mock-data';
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
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Link from 'next/link';

const menuOptionSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Option name is required."),
    priceAdjustment: z.coerce.number(),
});

const optionGroupSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Group name is required."),
    type: z.enum(['single', 'multiple', 'exclusion']),
    required: z.boolean().default(false),
    options: z.array(menuOptionSchema)
});

const crossSellGroupSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Group name is required."),
  productIds: z.array(z.string()),
});

const comboProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
});


const itemFormSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  category: z.string().min(1, 'Please select a category.'),
  description: z.string().optional(),
  imageUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  isActive: z.boolean(),
  allowNotes: z.boolean(),
  productType: z.enum(['single', 'combo', 'bundle']).default('single'),
  bundleTemplateId: z.string().optional(),
  optionGroups: z.array(optionGroupSchema).optional(),
  crossSellGroups: z.array(crossSellGroupSchema).optional(),
  comboProducts: z.array(comboProductSchema).optional(),
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
      allowNotes: initialData?.allowNotes !== undefined ? initialData.allowNotes : true,
      productType: initialData?.productType || 'single',
      bundleTemplateId: initialData?.bundleTemplateId || '',
      optionGroups: initialData?.optionGroups ? JSON.parse(JSON.stringify(initialData.optionGroups)) : [],
      crossSellGroups: initialData?.crossSellGroups ? JSON.parse(JSON.stringify(initialData.crossSellGroups)) : [],
      comboProducts: initialData?.comboProducts ? JSON.parse(JSON.stringify(initialData.comboProducts)) : [],
    },
  });

  const { control, watch, setValue } = form;
  const productType = watch('productType');

  const { fields: groupFields, append: appendGroup, remove: removeGroup, move: moveGroup } = useFieldArray({
      control,
      name: "optionGroups"
  });
  
  const { fields: crossSellGroupFields, append: appendCrossSellGroup, remove: removeCrossSellGroup, move: moveCrossSellGroup } = useFieldArray({
    control,
    name: "crossSellGroups"
  });

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

  const handleAddNewCrossSellGroup = () => {
    appendCrossSellGroup({
      id: `cs_group_${Date.now()}`,
      name: 'Goes great with',
      productIds: []
    })
  }
  
  const handleSelectBundleTemplate = (templateId: string) => {
    const template = mockBundleTemplates.find(t => t.id === templateId);
    if (template) {
        setValue('bundleTemplateId', template.id);
        setValue('price', template.basePrice);
        setValue('name', template.name);
        setValue('description', template.description);
    }
  }

  // Prevent already added groups from showing in the template list
  const existingGroupIds = watch('optionGroups')?.map(field => field.id) || [];
  const availableTemplates = allOptionGroups.filter(
    template => !existingGroupIds.some(id => id.includes(template.id)) // A bit tricky due to custom IDs
  );
  
  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)} className="space-y-6 p-1">
          {/* Basic Info */}
          <div className="space-y-4">
              <FormField
                  control={control}
                  name="productType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Product Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex items-center space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="single" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Single Product
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="combo" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Fixed Combo
                            </FormLabel>
                          </FormItem>
                           <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="bundle" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Flexible Bundle
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{productType === 'combo' ? 'Combo Name' : productType === 'bundle' ? 'Bundle Name' : 'Product Name'}</FormLabel>
                    <FormControl>
                      <Input placeholder={productType === 'combo' ? 'e.g., Lunch Special' : 'e.g., Classic Burger'} {...field} />
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
                      <FormLabel>{productType === 'single' ? 'Base Price' : 'Total Price'}</FormLabel>
                      <FormControl>
                          <Input type="number" step="0.01" placeholder="99.00" {...field} disabled={productType === 'bundle'}/>
                      </FormControl>
                      {productType === 'bundle' && <FormDescription>Price is set by the Bundle Template.</FormDescription>}
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
                                  {(productType === 'combo' || productType === 'bundle') && <SelectItem value="Combo">Combo</SelectItem>}
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
          
          {productType === 'bundle' ? (
            <FormField
              control={control}
              name="bundleTemplateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bundle Template</FormLabel>
                   <FormDescription>Select a pre-defined template to create this flexible bundle.</FormDescription>
                  <Select onValueChange={(value) => handleSelectBundleTemplate(value)} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a bundle template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockBundleTemplates.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                              {template.name} - ${template.basePrice.toFixed(2)}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Manage templates on the <Link href="/bundle-templates" className="text-primary underline">Bundle Templates</Link> page.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : productType === 'combo' ? (
              <ComboProductsSection />
            ) : (
              <>
                <Separator />
                
                {/* Option Groups Section */}
                <div>
                  <h3 className="text-lg font-medium font-headline">Product Options</h3>
                  <FormDescription>Add and customize modifiers for this product, like sizes or toppings. Drag to reorder.</FormDescription>
                  
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
                  <FormDescription>Suggest other products to customers when they view this item. You can reorder groups and items.</FormDescription>
                  
                  <div className="mt-4 space-y-4">
                    {crossSellGroupFields.map((group, groupIndex) => (
                      <CrossSellGroupCard
                        key={group.id}
                        groupIndex={groupIndex}
                        initialDataId={initialData?.id}
                        onRemoveGroup={() => removeCrossSellGroup(groupIndex)}
                        onMoveUp={() => groupIndex > 0 && moveCrossSellGroup(groupIndex, groupIndex - 1)}
                        onMoveDown={() => groupIndex < crossSellGroupFields.length - 1 && moveCrossSellGroup(groupIndex, groupIndex + 1)}
                      />
                    ))}

                    <Button type="button" variant="outline" onClick={handleAddNewCrossSellGroup}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Cross-sell Group
                    </Button>
                  </div>
                </div>
            </>
          )}


          {/* Status */}
            <div className="space-y-4 pt-4">
                <FormField
                    control={control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <FormLabel>Product Status</FormLabel>
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
                 {productType === 'single' && (<FormField
                    control={control}
                    name="allowNotes"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <FormLabel>Allow Customer Notes</FormLabel>
                            <FormDescription>
                            Allow customers to add special instructions for this item.
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
                />)}
            </div>
          
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
    const { control, watch } = useFormContext<ItemFormValues>();
    const group = watch(`optionGroups.${groupIndex}`);

    const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({
        control,
        name: `optionGroups.${groupIndex}.options`
    });

    const isExclusion = group.type === 'exclusion';

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
                                <FormControl>
                                    <Badge variant={isExclusion ? "secondary" : "outline"}>
                                        {isExclusion ? "Exclusion Group" : "Standard Group"}
                                    </Badge>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    {!isExclusion && (
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
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                 <CardDescription>
                    {isExclusion ? "Customer can choose to remove these ingredients (no cost)." : "Customer can choose from these options."}
                </CardDescription>
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
                        {!isExclusion && (
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
                        )}
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

// Inner component for managing a single cross-sell group
function CrossSellGroupCard({
  groupIndex,
  initialDataId,
  onRemoveGroup,
  onMoveUp,
  onMoveDown
}: {
  groupIndex: number,
  initialDataId?: string | null,
  onRemoveGroup: () => void,
  onMoveUp: () => void,
  onMoveDown: () => void,
}) {
  const { control, watch } = useFormContext<ItemFormValues>();

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: `crossSellGroups.${groupIndex}.productIds`
  });

  const watchedProductIds = watch(`crossSellGroups.${groupIndex}.productIds`) || [];
  
  const availableCrossSellProducts = mockMenuItems.filter(
    item => item.id !== initialDataId && !watchedProductIds.includes(item.id)
  );

  const selectedProducts = watchedProductIds.map(id => 
    mockMenuItems.find(item => item.id === id)
  ).filter(Boolean) as MenuItem[];

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
      <CardHeader>
        <div className="flex items-start justify-between">
          <FormField
            control={control}
            name={`crossSellGroups.${groupIndex}.name`}
            render={({ field }) => (
                <FormItem className="flex-1">
                    <FormControl>
                        <Input {...field} className="text-base font-semibold font-headline tracking-tight border-dashed" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
          />
          <Button variant="ghost" size="icon" onClick={onRemoveGroup} className="ml-2 shrink-0">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Product to Group
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
                      onSelect={() => append(item.id)}
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

        {selectedProducts.length > 0 && (
          <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='w-16'>Product</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead className="text-right w-28">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {fields.map((field, index) => {
                        const productId = watchedProductIds[index];
                        const item = selectedProducts.find(p => p.id === productId);
                        if (!item) return null;
                        return (
                        <TableRow key={field.id}>
                            <TableCell>
                                    <Image
                                    src={item.imageUrl || `https://picsum.photos/seed/${item.id}/64/64`}
                                    alt={item.name}
                                    width={48}
                                    height={48}
                                    className="rounded-md object-cover"
                                    />
                            </TableCell>
                            <TableCell>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end items-center gap-1">
                                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => index > 0 && move(index, index - 1)}>
                                        <ArrowUp className="h-4 w-4"/>
                                    </Button>
                                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => index < fields.length - 1 && move(index, index + 1)}>
                                        <ArrowDown className="h-4 w-4"/>
                                    </Button>
                                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => remove(index)}>
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ComboProductsSection() {
    const { control, watch } = useFormContext<ItemFormValues>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "comboProducts"
    });

    const addedProductIds = watch('comboProducts')?.map(p => p.id) || [];
    const availableProducts = mockMenuItems.filter(
        item => item.productType !== 'combo' && !addedProductIds.includes(item.id)
    );

    const handleSelectProduct = (productId: string) => {
        const product = mockMenuItems.find(p => p.id === productId);
        if (product) {
            append({ id: product.id, name: product.name, quantity: 1 });
        }
    };

    return (
        <div>
            <h3 className="text-lg font-medium font-headline">Products in Combo</h3>
            <FormDescription>Select the products and quantities that make up this combo.</FormDescription>

            <div className="mt-4 space-y-4">
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Product to Combo
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                <Command>
                                    <CommandInput placeholder="Search products..." />
                                    <CommandList>
                                        <CommandEmpty>No products found.</CommandEmpty>
                                        <CommandGroup>
                                            {availableProducts.map((item) => (
                                                <CommandItem
                                                    key={item.id}
                                                    value={item.name}
                                                    onSelect={() => handleSelectProduct(item.id)}
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
                        
                        {fields.length > 0 && (
                          <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="w-32">Quantity</TableHead>
                                        <TableHead className="w-16 text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((field, index) => (
                                        <TableRow key={field.id}>
                                            <TableCell className="font-medium">
                                                {watch(`comboProducts.${index}.name`)}
                                            </TableCell>
                                            <TableCell>
                                                <FormField
                                                    control={control}
                                                    name={`comboProducts.${index}.quantity`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input type="number" min="1" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                          </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
