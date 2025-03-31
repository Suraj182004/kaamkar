'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { createBudget } from '@/lib/firebase/budgets';
import { DEFAULT_EXPENSE_CATEGORIES } from '@/lib/firebase/transactions';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const formSchema = z.object({
  amount: z.string().min(1, { message: 'Amount is required' }).refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Amount must be a positive number',
  }),
  category: z.string().min(1, { message: 'Category is required' }),
  month: z.string().min(1, { message: 'Month is required' }).regex(/^\d{4}-\d{2}$/, {
    message: 'Month must be in YYYY-MM format',
  }),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

// Generate month options for the past year and next year
const generateMonthOptions = () => {
  const options = [];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  
  // Previous year
  for (let month = 0; month < 12; month++) {
    const date = new Date(currentYear - 1, month, 1);
    options.push({
      value: format(date, 'yyyy-MM'),
      label: format(date, 'MMMM yyyy')
    });
  }
  
  // Current year
  for (let month = 0; month < 12; month++) {
    const date = new Date(currentYear, month, 1);
    options.push({
      value: format(date, 'yyyy-MM'),
      label: format(date, 'MMMM yyyy')
    });
  }
  
  // Next year
  for (let month = 0; month < 12; month++) {
    const date = new Date(currentYear + 1, month, 1);
    options.push({
      value: format(date, 'yyyy-MM'),
      label: format(date, 'MMMM yyyy')
    });
  }
  
  return options;
};

const monthOptions = generateMonthOptions();

interface BudgetFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function BudgetForm({ onSuccess, onCancel }: BudgetFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
      category: '',
      month: format(new Date(), 'yyyy-MM'),
      notes: '',
    },
  });

  async function onSubmit(data: FormData) {
    if (!user) return;

    setIsSubmitting(true);
    try {
      await createBudget({
        userId: user.uid,
        amount: Number(data.amount),
        category: data.category,
        month: data.month,
        spent: 0, // Initial spent amount is 0
        notes: data.notes,
      });
      
      toast.success('Budget created successfully');
      form.reset({
        amount: '',
        category: '',
        month: format(new Date(), 'yyyy-MM'),
        notes: '',
      });
      onSuccess?.();
    } catch (error) {
      console.error('Error creating budget:', error);
      toast.error('Failed to create budget');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DEFAULT_EXPENSE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
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
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Amount</FormLabel>
              <FormControl>
                <Input placeholder="0.00" {...field} />
              </FormControl>
              <FormDescription>
                Set your budget limit for this category
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Month</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {monthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any notes about this budget"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Budget'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 