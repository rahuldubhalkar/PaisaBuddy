'use server';

/**
 * @fileOverview A flow to generate India-centric examples and scenarios for financial concepts.
 *
 * - generateIndiaCentricContent - A function that generates India-centric content.
 * - GenerateIndiaCentricContentInput - The input type for the generateIndiaCentricContent function.
 * - GenerateIndiaCentricContentOutput - The return type for the generateIndiaCentricContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateIndiaCentricContentInputSchema = z.object({
  financialConcept: z.string().describe('The financial concept to explain.'),
});
export type GenerateIndiaCentricContentInput = z.infer<typeof GenerateIndiaCentricContentInputSchema>;

const GenerateIndiaCentricContentOutputSchema = z.object({
  indiaCentricExample: z.string().describe('An India-centric example of the financial concept.'),
  indiaCentricScenario: z.string().describe('An India-centric scenario of the financial concept.'),
});
export type GenerateIndiaCentricContentOutput = z.infer<typeof GenerateIndiaCentricContentOutputSchema>;

export async function generateIndiaCentricContent(
  input: GenerateIndiaCentricContentInput
): Promise<GenerateIndiaCentricContentOutput> {
  return generateIndiaCentricContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateIndiaCentricContentPrompt',
  input: {schema: GenerateIndiaCentricContentInputSchema},
  output: {schema: GenerateIndiaCentricContentOutputSchema},
  prompt: `You are an expert in creating India-centric financial content for young adults.

  Given the financial concept: {{{financialConcept}}}

  Provide an India-centric example and an India-centric scenario that illustrates the concept.

  Example:
  Scenario:`,
});

const generateIndiaCentricContentFlow = ai.defineFlow(
  {
    name: 'generateIndiaCentricContentFlow',
    inputSchema: GenerateIndiaCentricContentInputSchema,
    outputSchema: GenerateIndiaCentricContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
