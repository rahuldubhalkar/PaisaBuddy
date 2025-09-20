'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { useLearningModules } from '@/components/learning-modules-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Award, RotateCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

export default function ModuleQuizPage() {
  const params = useParams();
  const { moduleId } = params as { moduleId: string };
  const { getModuleById, updateModuleProgress } = useLearningModules();
  
  const module = getModuleById(moduleId);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (module && module.progress === 100) {
      setSubmitted(true);
      // This is a simplified way to show a completed state.
      // In a real app, you'd likely store the user's actual answers.
      const correctAnswers: Record<string, string> = {};
      module.quiz.questions.forEach(q => {
        correctAnswers[q.id] = q.answer;
      });
      setSelectedAnswers(correctAnswers);
      setScore(module.quiz.questions.length);
    } else {
        // Reset state if it's a new attempt
        setSubmitted(false);
        setSelectedAnswers({});
        setScore(0);
    }
  }, [module]);

  if (!module || !module.quiz) {
    notFound();
  }

  const handleAnswerChange = (questionId: string, value: string) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    if (submitted) return;
    const calculatedScore = module.quiz.questions.reduce((correct, q) => {
      return selectedAnswers[q.id] === q.answer ? correct + 1 : correct;
    }, 0);
    
    setScore(calculatedScore);
    const progress = Math.round((calculatedScore / module.quiz.questions.length) * 100);
    updateModuleProgress(moduleId, progress);
    setSubmitted(true);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
    updateModuleProgress(moduleId, 0); // Reset progress
  };
  
  const isQuizCompleted = submitted || module.progress === 100;
  const finalScore = isQuizCompleted ? score : 0;
  const finalProgress = isQuizCompleted ? Math.round((finalScore / module.quiz.questions.length) * 100) : 0;


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
                  <Alert variant="default" className="border-green-500 text-green-700 bg-green-50">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <AlertTitle>Correct!</AlertTitle>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                     <XCircle className="h-5 w-5" />
                    <AlertTitle>Incorrect</AlertTitle>
                    <AlertDescription>The correct answer is: <strong>{q.answer}</strong></AlertDescription>
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
            <Card className="text-center p-6 bg-secondary">
              <CardTitle className="text-2xl font-bold mb-2">
                {finalProgress === 100 ? 'Quiz Mastered!' : 'Quiz Complete!'}
              </CardTitle>
              <CardDescription className="mb-4">
                You scored {finalScore} out of {module.quiz.questions.length}.
              </CardDescription>
              <Progress value={finalProgress} className="w-full h-3 mb-4" />
              <div className="flex justify-center gap-4 mt-4">
                  <Button variant="outline" asChild>
                    <Link href="/learn">
                        Back to Modules
                    </Link>
                  </Button>
                  {finalProgress !== 100 && (
                    <Button onClick={handleRetake}>
                      <RotateCw className="mr-2 h-4 w-4" />
                      Retake Quiz
                    </Button>
                  )}
              </div>
            </Card>
        )}
      </CardContent>
    </Card>
  );
}
