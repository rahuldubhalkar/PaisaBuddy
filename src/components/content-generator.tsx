'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Sparkles, Wand2 } from 'lucide-react';
import { generateContentAction } from '@/app/(main)/generate/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? (
        <>
          <Sparkles className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Generate Content
        </>
      )}
    </Button>
  );
}

export function ContentGenerator() {
  const initialState = {};
  const [state, formAction] = useActionState(generateContentAction, initialState);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Enter a Financial Concept</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <Input
                name="financialConcept"
                placeholder="e.g., Compound Interest, Diversification, Rupee Cost Averaging"
                className="flex-grow"
                required
              />
              <SubmitButton />
            </div>
            {state?.message && !state.data && (
                <p className="text-sm font-medium text-destructive">{state.message}</p>
            )}
          </form>
        </CardContent>
      </Card>

      {state?.data && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>India-Centric Example</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-card-foreground">
              <p>{state.data.indiaCentricExample}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>India-Centric Scenario</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-card-foreground">
              <p>{state.data.indiaCentricScenario}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
