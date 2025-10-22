
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting product collections,
 * including a generated name, description, and a set of rules (conditions)
 * based on a user-provided description of desired products.
 *
 * - suggestProductCollections - A function that takes a description and returns suggested collections.
 * - ProductCollectionSuggestionInput - The input type for the function.
 * - ProductCollectionSuggestionOutput - The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the schema for a single condition (replicates product collection form logic)
const conditionSchema = z.object({
  id: z.string().optional(),
  type: z.string().describe("Must be the string 'condition'"),
  criteria: z.enum(['category', 'price', 'profit_margin', 'stock_level', 'tags']),
  operator: z.enum(['eq', 'neq', 'gte', 'lte', 'contains']),
  value: z.union([z.string(), z.number()]),
});

// Define the schema for a group of conditions
const conditionGroupSchema: z.ZodTypeAny = z.lazy(() =>
  z.object({
    id: z.string().optional(),
    type: z.string().describe("Must be the string 'group'"),
    logic: z.enum(['AND', 'OR']),
    conditions: z.array(z.union([conditionSchema, conditionGroupSchema])),
  })
);

// Define the schema for a single suggested collection
const SuggestedCollectionSchema = z.object({
    name: z.string().describe("A concise, descriptive name for internal admin use."),
    description: z.string().describe("A short, insightful description for internal admin use."),
    publicTitle: z.string().describe("A customer-facing, attractive title for the collection (e.g., 'Weekend Specials')."),
    publicSubtitle: z.string().describe("A short, catchy subtitle for marketing purposes (e.g., 'Limited time only!')."),
    suggestedConditions: conditionGroupSchema.describe("The set of rules that defines this collection. This should be a logical starting point based on the collection name and description."),
});

// Define the overall input and output schemas for the flow
const ProductCollectionSuggestionInputSchema = z.object({
  description: z.string().describe("A user's natural language description of a desired product grouping."),
});
export type ProductCollectionSuggestionInput = z.infer<typeof ProductCollectionSuggestionInputSchema>;

const ProductCollectionSuggestionOutputSchema = z.object({
  suggestions: z
    .array(SuggestedCollectionSchema)
    .describe("An array of 2-3 suggested product collections, each with internal names, public titles, and a set of pre-defined conditions."),
});
export type ProductCollectionSuggestionOutput = z.infer<typeof ProductCollectionSuggestionOutputSchema>;
export type SuggestedCollection = z.infer<typeof SuggestedCollectionSchema>;


export async function suggestProductCollections(
  input: ProductCollectionSuggestionInput
): Promise<ProductCollectionSuggestionOutput> {
  return suggestProductCollectionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productCollectionSuggestionPrompt',
  input: { schema: ProductCollectionSuggestionInputSchema },
  output: { schema: ProductCollectionSuggestionOutputSchema },
  prompt: `You are an expert restaurant consultant and merchandiser. Your task is to help a restaurant owner create dynamic product collections for their menu.
Given the user's description, you will suggest 2-3 distinct and relevant product collections.

For each collection, you MUST provide:
1.  'name': A clear and concise name for INTERNAL, administrative use (e.g., "Low Stock Items", "High Profit Mains"). This should be purely logical.
2.  'description': A brief description for INTERNAL use.
3.  'publicTitle': An attractive, customer-facing title for display on the app (e.g., "Last Chance to Buy!", "Chef's Recommendations"). This should be marketing-friendly.
4.  'publicSubtitle': A short, catchy marketing subtitle.
5.  'suggestedConditions': A set of logical rules that defines the collection.

IMPORTANT: The internal 'name' and the public 'publicTitle' serve different purposes and should be different. One is for management, the other for marketing. For example, if the user asks for "món bán ế" (slow-selling items), the internal 'name' could be "Slow-Sellers", but the 'publicTitle' should be something appealing like "Limited Stock Specials" or "Last Call".

For conditions, the 'type' field must be either 'condition' or 'group'.

Available criteria for product rules and their value types:
- 'category': string (e.g., 'Main Course', 'Appetizers', 'Desserts', 'Drinks')
- 'price': number (e.g., 25.50)
- 'profit_margin': number (e.g., 60, representing 60%)
- 'stock_level': number (e.g., 15, representing items in stock)
- 'tags': string (e.g., 'spicy', 'vegan', 'gluten-free', 'featured')

Available operators:
- For numbers ('price', 'profit_margin', 'stock_level'): 'gte' (>=), 'lte' (<=), 'eq' (==)
- For strings ('category', 'tags'): 'eq' (is exactly), 'neq' (is not), 'contains'

User's Description of desired product group:
"{{{description}}}"
`,
});

const suggestProductCollectionsFlow = ai.defineFlow(
  {
    name: 'suggestProductCollectionsFlow',
    inputSchema: ProductCollectionSuggestionInputSchema,
    outputSchema: ProductCollectionSuggestionOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
