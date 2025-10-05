'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
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
import { useToast } from '@/hooks/use-toast';

const conditionSchema = z.object({
  criteria: z.enum(['totalSpend', 'lastVisit', 'orderFrequency', 'membershipLevel']),
  operator: z.enum(['gte', 'lte', 'eq', 'neq', 'before', 'after']),
  value: z.union([z.string().min(1), z.number().min(0), z.date()]),
});

const segmentFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Segment name must be at least 2 characters.',
  }),
  conditions: z.array(conditionSchema).min(1, {
    message: 'At least one condition is required.',
  }),
});

type SegmentFormValues = z.infer<typeof segmentFormSchema>;

const criteriaOptions = [
  { value: 'totalSpend', label: 'Total Spend' },
  { value: 'lastVisit', label: 'Last Visit' },
  { value: 'orderFrequency', label: 'Order Frequency' },
  { value: 'membershipLevel', label: 'Membership Level' },
];

const operatorOptions = {
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

export function CreateSegmentForm({ onSave, onCancel, isSaving }: CreateSegmentFormProps) {
    const { toast } = useToast();
  const form = useForm<SegmentFormValues>({
    resolver: zodResolver(segmentFormSchema),
    defaultValues: {
      name: '',
      conditions: [{ criteria: 'totalSpend', operator: 'gte', value: 100 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'conditions',
  });

  function onSubmit(data: SegmentFormValues) {
    onSave(data);
  }

  const renderValueInput = (index: number) => {
    const criteria = form.watch(`conditions.${index}.criteria`);
    switch (criteria) {
      case 'lastVisit':
        return (
          <FormField
            control={form.control}
            name={`conditions.${index}.value`}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
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
            name={`conditions.${index}.value`}
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
                name={`conditions.${index}.value`}
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
          <div className="space-y-4 mt-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2 p-3 border rounded-md relative">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1">
                    <FormField
                    control={form.control}
                    name={`conditions.${index}.criteria`}
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
                    control={form.control}
                    name={`conditions.${index}.operator`}
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select operator" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(operatorOptions[form.watch(`conditions.${index}.criteria`)] || []).map(
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
                  {renderValueInput(index)}
                 </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 1}
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ criteria: 'totalSpend', operator: 'gte', value: '' })}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Condition
        </Button>
        
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
