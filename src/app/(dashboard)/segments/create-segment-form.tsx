
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const conditionSchema = z.object({
  type: z.literal('condition'),
  criteria: z.enum(['totalSpend', 'lastVisit', 'orderFrequency', 'membershipLevel']),
  operator: z.enum(['gte', 'lte', 'eq', 'neq', 'before', 'after']),
  value: z.union([z.string().min(1), z.number().min(0), z.date()]),
});

const conditionGroupSchema: z.ZodTypeAny = z.lazy(() =>
  z.object({
    type: z.literal('group'),
    logic: z.enum(['AND', 'OR']),
    conditions: z.array(z.union([conditionSchema, conditionGroupSchema])),
  })
);

const segmentFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Segment name must be at least 2 characters.',
  }),
  root: conditionGroupSchema,
});


type SegmentFormValues = z.infer<typeof segmentFormSchema>;
type Condition = z.infer<typeof conditionSchema>;
type ConditionGroup = z.infer<typeof conditionGroupSchema>;

const criteriaOptions = [
  { value: 'totalSpend', label: 'Total Spend' },
  { value: 'lastVisit', label: 'Last Visit' },
  { value: 'orderFrequency', label: 'Order Frequency' },
  { value: 'membershipLevel', label: 'Membership Level' },
];

const operatorOptions: Record<Condition['criteria'], { value: string; label: string }[]> = {
  totalSpend: [
    { value: 'gte', label: 'is greater than or equal to' },
    { value: 'lte', label: 'is less than or equal to' },
    { value: 'eq', label: 'is equal to' },
  ],
  lastVisit: [
    { value: 'before', label: 'is before' },
    { value: 'after', label: 'is after' },
  ],
  orderFrequency: [
    { value: 'gte', label: 'is greater than or equal to' },
    { value: 'lte', label: 'is less than or equal to' },
  ],
  membershipLevel: [
    { value: 'eq', label: 'is' },
    { value: 'neq', label: 'is not' },
  ],
};

interface CreateSegmentFormProps {
  onSave: (data: SegmentFormValues) => void;
  onCancel: () => void;
  isSaving: boolean;
}

const renderValueInput = (path: string, index: number) => {
    const form = useFormContext();
    const criteria = form.watch(`${path}.conditions.${index}.criteria`);
    switch (criteria) {
      case 'lastVisit':
        return (
          <FormField
            control={form.control}
            name={`${path}.conditions.${index}.value`}
            render={({ field }) => (
              <FormItem>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 'totalSpend':
      case 'orderFrequency':
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
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 'membershipLevel':
         return (
            <FormField
                control={form.control}
                name={`${path}.conditions.${index}.value`}
                render={({ field }) => (
                <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Bronze">Bronze</SelectItem>
                            <SelectItem value="Silver">Silver</SelectItem>
                            <SelectItem value="Gold">Gold</SelectItem>
                        </SelectContent>
                    </Select>
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
    <div className="flex items-start gap-2 p-3 border rounded-md relative bg-background">
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
        className="shrink-0"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}

function ConditionGroup({ path, onRemoveGroup }: { path: string; onRemoveGroup?: () => void }) {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${path}.conditions`
  });
  
  const addCondition = () => append({ type: 'condition', criteria: 'totalSpend', operator: 'gte', value: 100 });
  const addGroup = () => append({ type: 'group', logic: 'AND', conditions: [] });

  const conditions = watch(`${path}.conditions`);

  return (
    <div className="p-4 border rounded-lg bg-slate-50 space-y-4">
      <div className="flex items-center justify-between">
        <FormField
          control={control}
          name={`${path}.logic`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="AND" />
                    </FormControl>
                    <FormLabel className="font-normal">AND</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="OR" />
                    </FormControl>
                    <FormLabel className="font-normal">OR</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        {onRemoveGroup && (
             <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRemoveGroup}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4"/> Remove Group
            </Button>
        )}
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => {
          const condition = conditions[index];
          if (condition.type === 'group') {
            return <ConditionGroup key={field.id} path={`${path}.conditions.${index}`} onRemoveGroup={() => remove(index)} />;
          }
          return <ConditionRow key={field.id} path={path} index={index} onRemove={() => remove(index)} />;
        })}
      </div>

      <div className="flex gap-2">
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
    </div>
  );
}


export function CreateSegmentForm({ onSave, onCancel, isSaving }: CreateSegmentFormProps) {
  const form = useForm<SegmentFormValues>({
    resolver: zodResolver(segmentFormSchema),
    defaultValues: {
      name: '',
      root: {
        type: 'group',
        logic: 'AND',
        conditions: [
          { type: 'condition', criteria: 'totalSpend', operator: 'gte', value: 100 },
        ],
      },
    },
  });

  function onSubmit(data: SegmentFormValues) {
    onSave(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Segment Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., High Value Customers" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          <FormLabel>Conditions</FormLabel>
          <div className="mt-2">
            <ConditionGroup path="root" />
          </div>
        </div>

        <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onCancel} disabled={isSaving}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Segment'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
