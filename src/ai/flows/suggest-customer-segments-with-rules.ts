
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting customer segments,
 * including a generated name, description, and a set of rules (conditions)
 * based on a user-provided description.
 *
 * - suggestCustomerSegmentsWithRules - A function that takes a description and returns suggested segments.
 * - CustomerSegmentationInput - The input type for the function.
 * - CustomerSegmentationOutput - The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the schema for a single condition (replicates form logic)
const conditionSchema = z.object({
  id: z.string().optional(),
  type: z.string().describe("Must be the string 'condition'"),
  criteria: z.enum(['totalSpend', 'lastVisit', 'orderFrequency', 'membershipLevel']),
  operator: z.enum(['gte', 'lte', 'eq', 'neq', 'before', 'after']),
  value: z.union([z.string(), z.number(), z.date()]),
});

// Define the schema for a group of conditions (replicates form logic)
const conditionGroupSchema: z.ZodTypeAny = z.lazy(() =>
  z.object({
    id: z.string().optional(),
    type: z.string().describe("Must be the string 'group'"),
    logic: z.enum(['AND', 'OR']),
    conditions: z.array(z.union([conditionSchema, conditionGroupSchema])),
  })
);

// Define the schema for a single suggested segment
const SuggestedSegmentSchema = z.object({
    name: z.string().describe("A concise, descriptive name for the customer segment."),
    description: z.string().describe("A short, insightful description for the customer segment."),
    suggestedConditions: conditionGroupSchema.describe("The set of rules that defines this segment. This should be a logical starting point based on the segment name and description."),
});

// Define the overall input and output schemas for the flow
const CustomerSegmentationInputSchema = z.object({
  description: z.string().describe("A user's natural language description of a desired customer segment."),
});
export type CustomerSegmentationInput = z.infer<typeof CustomerSegmentationInputSchema>;

const CustomerSegmentationOutputSchema = z.object({
  suggestions: z
    .array(SuggestedSegmentSchema)
    .describe("An array of 3-4 suggested customer segments, each with a name, description, and a set of pre-defined conditions."),
});
export type CustomerSegmentationOutput = z.infer<typeof CustomerSegmentationOutputSchema>;
export type SuggestedSegment = z.infer<typeof SuggestedSegmentSchema>;


export async function suggestCustomerSegmentsWithRules(
  input: CustomerSegmentationInput
): Promise<CustomerSegmentationOutput> {
  return suggestCustomerSegmentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customerSegmentationWithRulesPrompt',
  input: { schema: CustomerSegmentationInputSchema },
  output: { schema: CustomerSegmentationOutputSchema },
  prompt: `You are an expert marketing analyst. Your task is to help a restaurant owner create customer segments.
Given the user's description, you will suggest 3-4 distinct and relevant customer segments.

For each segment, you MUST provide:
1.  A clear and concise 'name'.
2.  A brief 'description' for internal use.
3.  A set of 'suggestedConditions' that logically defines the segment. These conditions must follow the provided schema.

For conditions, the 'type' field must be either 'condition' for a single rule or 'group' for a nested set of rules.

Available criteria and their types:
- 'totalSpend': number (e.g., 500)
- 'lastVisit': date (e.g., '2024-06-30T00:00:00.000Z')
- 'orderFrequency': number (e.g., 10, meaning number of orders)
- 'membershipLevel': string ('Bronze', 'Silver', 'Gold')

Operators:
- For numbers ('totalSpend', 'orderFrequency'): 'gte' (>=), 'lte' (<=), 'eq' (==)
- For dates ('lastVisit'): 'before', 'after'
- For strings ('membershipLevel'): 'eq' (==), 'neq' (!=)

IMPORTANT: When generating dates for the 'lastVisit' criteria, use a dynamic reference point. For example, to represent "in the last 30 days," use a date 30 days before the current date. Assume today's date is ${new Date().toISOString().split('T')[0]}.

User's Description:
"{{{description}}}"
`,
});

const suggestCustomerSegmentsFlow = ai.defineFlow(
  {
    name: 'suggestCustomerSegmentsWithRulesFlow',
    inputSchema: CustomerSegmentationInputSchema,
    outputSchema: CustomerSegmentationOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
