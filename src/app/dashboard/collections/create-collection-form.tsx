

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
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
import { PlusCircle, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import type { Collection } from './collections-context';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const conditionSchema = z.object({
  id: z.string().optional(),
  type: z.string().describe("Must be the string 'condition'"),
  criteria: z.enum(['category', 'price', 'profit_margin', 'stock_level', 'tags']),
  operator: z.enum(['eq', 'neq', 'gte', 'lte', 'contains']),
  value: z.union([z.string().min(1), z.number().min(0)]),
});

const conditionGroupSchema: z.ZodTypeAny = z.lazy(() =>
  z.object({
    id: z.string().optional(),
    type: z.string().describe("Must be the string 'group'"),
    logic: z.enum(['AND', 'OR']),
    conditions: z.array(z.union([conditionSchema, conditionGroupSchema])),
  })
);

const collectionFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Collection name must be at least 2 characters.',
  }),
  description: z.string().optional(),
  publicTitle: z.string().optional(),
  publicSubtitle: z.string().optional(),
  isActive: z.boolean(),
  root: conditionGroupSchema,
});


type CollectionFormValues = z.infer<typeof collectionFormSchema>;
type Condition = z.infer<typeof conditionSchema>;
type ConditionGroup = z.infer<typeof conditionGroupSchema>;

const criteriaOptions = [
  { value: 'category', label: 'Category' },
  { value: 'price', label: 'Price' },
  { value: 'profit_margin', label: 'Profit Margin (%)' },
  { value: 'stock_level', label: 'Stock Level' },
  { value: 'tags', label: 'Tags' },
];

const operatorOptions: Record<Condition['criteria'], { value: string; label: string }[]> = {
  category: [
    { value: 'eq', label: 'is' },
    { value: 'neq', label: 'is not' },
  ],
  price: [
    { value: 'gte', label: 'is greater than or equal to' },
    { value: 'lte', label: 'is less than or equal to' },
    { value: 'eq', label: 'is equal to' },
  ],
  profit_margin: [
    { value: 'gte', label: 'is greater than or equal to' },
    { value: 'lte', label: 'is less than or equal to' },
  ],
  stock_level: [
    { value: 'gte', label: 'is greater than or equal to' },
    { value: 'lte', label: 'is less than or equal to' },
  ],
  tags: [
      { value: 'contains', label: 'contains' },
      { value: 'eq', label: 'is exactly' },
  ]
};

interface CreateCollectionFormProps {
  onSave: (data: CollectionFormValues) => void;
  onCancel: () => void;
  isSaving: boolean;
  initialData: Partial<Collection> | null;
}

const renderValueInput = (path: string, index: number) => {
    const form = useFormContext();
    const criteria = form.watch(`${path}.conditions.${index}.criteria`);
    switch (criteria) {
      case 'price':
      case 'profit_margin':
      case 'stock_level':
        return (
          <FormField
            control={form.control}
            name={`${path}.conditions.${index}.value`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Value"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 'category':
        return (
            <FormField
                control={form.control}
                name={`${path}.conditions.${index}.value`}
                render={({ field }) => (
                <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select category" />
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
        );
      case 'tags':
         return (
          <FormField
            control={form.control}
            name={`${path}.conditions.${index}.value`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="e.g. spicy, vegan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      default:
        return <Input placeholder="Value" disabled />;
    }
  };

function ConditionRow({ path, index, onRemove }: { path: string; index: number; onRemove: () => void }) {
  const { control, watch } = useFormContext();
  const criteria = watch(`${path}.conditions.${index}.criteria`);
  return (
    <div className="flex items-start gap-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1">
        <FormField
          control={control}
          name={`${path}.conditions.${index}.criteria`}
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select criteria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {criteriaOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${path}.conditions.${index}.operator`}
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select operator" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(operatorOptions[criteria] || []).map(
                    (opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {renderValueInput(path, index)}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="shrink-0 mt-1 text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

function LogicSelector({ path }: { path: string }) {
    const { control } = useFormContext();

    return (
        <div className="flex items-center my-2">
            <div className="h-px bg-border flex-1" />
            <FormField
                control={control}
                name={path}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className="w-auto mx-2 border-dashed">
                                <SelectValue />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="AND">AND</SelectItem>
                            <SelectItem value="OR">OR</SelectItem>
                        </SelectContent>
                    </Select>
                )}
            />
            <div className="h-px bg-border flex-1" />
        </div>
    );
}

function ConditionGroup({ path, onRemoveGroup }: { path: string; onRemoveGroup?: () => void }) {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${path}.conditions`
  });
  
  const addCondition = () => append({ id: crypto.randomUUID(), type: 'condition', criteria: 'price', operator: 'gte', value: 10 });
  const addGroup = () => append({ id: crypto.randomUUID(), type: 'group', logic: 'AND', conditions: [] });

  const conditions = watch(`${path}.conditions`);

  return (
    <div className="p-4 border rounded-lg space-y-4 bg-muted/20">
      <div className="flex items-center justify-between gap-4">
        <div className='flex gap-2'>
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCondition}
                >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Condition
            </Button>
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addGroup}
                >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Group
            </Button>
        </div>
          {onRemoveGroup && (
              <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onRemoveGroup}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4"/>
                  <span className="sr-only">Remove Group</span>
              </Button>
          )}
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
            <React.Fragment key={field.id}>
                {index > 0 && <LogicSelector path={`${path}.logic`} />}
                {conditions[index].type === 'group' ? (
                    <ConditionGroup 
                        path={`${path}.conditions.${index}`} 
                        onRemoveGroup={() => remove(index)} 
                    />
                ) : (
                    <ConditionRow 
                        path={path} 
                        index={index} 
                        onRemove={() => remove(index)} 
                    />
                )}
            </React.Fragment>
        ))}
        {fields.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">This group is empty. Add a condition or a new group.</p>
        )}
      </div>
    </div>
  );
}


export function CreateCollectionForm({ onSave, onCancel, isSaving, initialData }: CreateCollectionFormProps) {
  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: initialData ? {
        name: initialData.name || '',
        description: initialData.description || '',
        publicTitle: initialData.publicTitle || '',
        publicSubtitle: initialData.publicSubtitle || '',
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
        root: initialData.root || {
            id: crypto.randomUUID(),
            type: 'group',
            logic: 'AND',
            conditions: [
              { id: crypto.randomUUID(), type: 'condition', criteria: 'price', operator: 'gte', value: 10 },
            ],
        },
    } : {
      name: '',
      description: '',
      publicTitle: '',
      publicSubtitle: '',
      isActive: true,
      root: {
        id: crypto.randomUUID(),
        type: 'group',
        logic: 'AND',
        conditions: [
          { id: crypto.randomUUID(), type: 'condition', criteria: 'price', operator: 'gte', value: 10 },
        ],
      },
    },
  });

  function onSubmit(data: CollectionFormValues) {
    onSave(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
            <h3 className="text-lg font-medium font-headline">Internal Details</h3>
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Collection Name</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Best Sellers, Weekend Specials" {...field} />
                </FormControl>
                <FormDescription>This name is for internal use and management.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                    <Textarea placeholder="An internal description for this collection." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <Separator />

         <div className="space-y-4">
            <h3 className="text-lg font-medium font-headline">Public Display</h3>
            <FormDescription>This is what customers will see in the app.</FormDescription>

            <FormField
            control={form.control}
            name="publicTitle"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Public Title</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Chef's Recommendations" {...field} />
                </FormControl>
                 <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="publicSubtitle"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Public Subtitle (Optional)</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Limited time only!" {...field} />
                </FormControl>
                 <FormMessage />
                </FormItem>
            )}
            />

             <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-4">
                    <div className="space-y-0.5">
                        <FormLabel>Status</FormLabel>
                        <FormDescription>
                        Set whether this collection is active and visible on the client app.
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
        </div>
        
        <Separator />

        <div>
          <h3 className="text-lg font-medium font-headline">Conditions</h3>
          <FormDescription>Products must match these conditions to be included in the collection.</FormDescription>
          <div className="mt-2">
            <ConditionGroup path="root" />
          </div>
        </div>

        <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onCancel} disabled={isSaving}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Collection'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
