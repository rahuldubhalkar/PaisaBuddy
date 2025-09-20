'use server';

import { z } from 'zod';
import {
  generateIndiaCentricContent,
  GenerateIndiaCentricContentOutput,
} from '@/ai/flows/generate-india-centric-content';

const schema = z.object({
  financialConcept: z.string().min(3, 'Please enter a financial concept.'),
});

interface ActionState {
  message?: string;
  data?: GenerateIndiaCentricContentOutput;
}

export async function generateContentAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const validatedFields = schema.safeParse({
    financialConcept: formData.get('financialConcept'),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.financialConcept?.[0],
    };
  }

  try {
    const output = await generateIndiaCentricContent({
      financialConcept: validatedFields.data.financialConcept,
    });
    return { data: output };
  } catch (error) {
    console.error(error);
    return { message: 'Failed to generate content. Please try again.' };
  }
}
