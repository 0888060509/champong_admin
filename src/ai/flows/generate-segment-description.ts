'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a description for a customer segment.
 *
 * - generateSegmentDescription - A function that takes a segment name and returns a suggested description.
 * - GenerateSegmentDescriptionInput - The input type for the function.
 * - GenerateSegmentDescriptionOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSegmentDescriptionInputSchema = z.object({
  name: z
    .string()
    .describe("The name of the customer segment."),
});
export type GenerateSegmentDescriptionInput = z.infer<typeof GenerateSegmentDescriptionInputSchema>;

const GenerateSegmentDescriptionOutputSchema = z.object({
  description: z
    .string()
    .describe("A short, insightful description for the customer segment."),
});
export type GenerateSegmentDescriptionOutput = z.infer<typeof GenerateSegmentDescriptionOutputSchema>;

export async function generateSegmentDescription(
  input: GenerateSegmentDescriptionInput
): Promise<GenerateSegmentDescriptionOutput> {
  return generateSegmentDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSegmentDescriptionPrompt',
  input: {schema: GenerateSegmentDescriptionInputSchema},
  output: {schema: GenerateSegmentDescriptionOutputSchema},
  prompt: `You are a marketing expert. Given the following customer segment name, write a short, insightful description for it. This description will be used internally for managing the segment.

Segment Name: {{{name}}}`,
});

const generateSegmentDescriptionFlow = ai.defineFlow(
  {
    name: 'generateSegmentDescriptionFlow',
    inputSchema: GenerateSegmentDescriptionInputSchema,
    outputSchema: GenerateSegmentDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
