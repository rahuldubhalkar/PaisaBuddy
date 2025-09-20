'use client';

import { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { modules } from '@/lib/learning-modules-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Award } from 'lucide-react';

export default function ModuleQuizPage() {
  const params = useParams();
  const { moduleId } = params;
  const module = modules.find((m) => m.id === moduleId);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!module || !module.quiz) {
    notFound();
  }

  const handleAnswerChange = (questionId: string, value: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const score = Object.keys(selectedAnswers).reduce((correct, qId) => {
    const question = module.quiz.questions.find(q => q.id === qId);
    if (question && selectedAnswers[qId] === question.answer) {
      return correct + 1;
    }
    return correct;
  }, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
            <Award className="h-6 w-6 text-primary"/>
            <CardTitle>Quiz: {module.title}</CardTitle>
        </div>
        <CardDescription>Test your knowledge from this module.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {module.quiz.questions.map((q, index) => (
          <div key={q.id}>
            <p className="font-semibold mb-2">{index + 1}. {q.text}</p>
            <RadioGroup
              value={selectedAnswers[q.id]}
              onValueChange={(value) => handleAnswerChange(q.id, value)}
              disabled={submitted}
            >
              {q.options.map(opt => (
                <div className="flex items-center space-x-2" key={opt}>
                  <RadioGroupItem value={opt} id={`${q.id}-${opt}`} />
                  <Label htmlFor={`${q.id}-${opt}`}>{opt}</Label>
                </div>
              ))}
            </RadioGroup>
            {submitted && (
              <div className="mt-2">
                {selectedAnswers[q.id] === q.answer ? (
                  <Alert variant="default" className="border-green-500 text-green-700">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <AlertTitle>Correct!</AlertTitle>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                     <XCircle className="h-5 w-5" />
                    <AlertTitle>Incorrect</AlertTitle>
                    <AlertDescription>The correct answer is: {q.answer}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        ))}
        {!submitted ? (
            <Button onClick={handleSubmit} disabled={Object.keys(selectedAnswers).length !== module.quiz.questions.length}>
                Submit Answers
            </Button>
        ) : (
            <div className="text-center p-4 border rounded-lg bg-secondary">
                <p className="font-bold text-lg">Quiz Complete!</p>
                <p>You scored {score} out of {module.quiz.questions.length}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
