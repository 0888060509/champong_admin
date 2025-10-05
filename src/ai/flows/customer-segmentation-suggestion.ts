'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting customer segments based on a user-provided description.
 *
 * - suggestCustomerSegments - A function that takes a description and returns suggested customer segments.
 * - CustomerSegmentationInput - The input type for the suggestCustomerSegments function.
 * - CustomerSegmentationOutput - The output type for the suggestCustomerSegments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomerSegmentationInputSchema = z.object({
  description: z
    .string()
    .describe("A short description of the desired customer segment."),
});
export type CustomerSegmentationInput = z.infer<typeof CustomerSegmentationInputSchema>;

const CustomerSegmentationOutputSchema = z.object({
  segments: z
    .array(z.string())
    .describe("An array of suggested customer segments based on the description."),
});
export type CustomerSegmentationOutput = z.infer<typeof CustomerSegmentationOutputSchema>;

export async function suggestCustomerSegments(
  input: CustomerSegmentationInput
): Promise<CustomerSegmentationOutput> {
  return suggestCustomerSegmentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customerSegmentationPrompt',
  input: {schema: CustomerSegmentationInputSchema},
  output: {schema: CustomerSegmentationOutputSchema},
  prompt: `You are an expert marketing assistant. Given the following description of a desired customer segment, suggest a few relevant customer segments.  Return the segments as a JSON array of strings.

Description: {{{description}}}`,
});

const suggestCustomerSegmentsFlow = ai.defineFlow(
  {
    name: 'suggestCustomerSegmentsFlow',
    inputSchema: CustomerSegmentationInputSchema,
    outputSchema: CustomerSegmentationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
