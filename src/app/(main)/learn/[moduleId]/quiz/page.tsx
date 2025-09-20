'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { useLearningModules } from '@/components/learning-modules-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Award, RotateCw, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function ModuleQuizPage() {
  const params = useParams();
  const { moduleId } = params as { moduleId: string };
  const { getModuleById, updateModuleProgress } = useLearningModules();

  const module = getModuleById(moduleId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (module && module.progress === 100) {
      setSubmitted(true);
      const correctAnswers: Record<string, string> = {};
      let correctCount = 0;
      module.quiz.questions.forEach(q => {
        const storedAnswer = localStorage.getItem(`quiz-${moduleId}-q-${q.id}`);
        if (storedAnswer) {
            correctAnswers[q.id] = storedAnswer;
            if (storedAnswer === q.answer) correctCount++;
        }
      });
      setSelectedAnswers(correctAnswers);
      setScore(correctCount);

    } else {
      setSubmitted(false);
      setSelectedAnswers({});
      setScore(0);
      setCurrentQuestionIndex(0);
    }
  }, [moduleId, module]);

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
      // Save answer to local storage for review later
      if(selectedAnswers[q.id]) {
        localStorage.setItem(`quiz-${moduleId}-q-${q.id}`, selectedAnswers[q.id]);
      }
      return selectedAnswers[q.id] === q.answer ? correct + 1 : correct;
    }, 0);
    
    setScore(calculatedScore);
    const progress = Math.round((calculatedScore / module.quiz.questions.length) * 100);
    updateModuleProgress(moduleId, progress);
    setSubmitted(true);
  };

  const handleRetake = () => {
    module.quiz.questions.forEach(q => {
        localStorage.removeItem(`quiz-${moduleId}-q-${q.id}`);
    });
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    updateModuleProgress(moduleId, 0);
  };
  
  const isQuizCompleted = submitted || module.progress === 100;
  const totalQuestions = module.quiz.questions.length;
  const finalScore = isQuizCompleted ? score : 0;
  const finalProgress = isQuizCompleted ? Math.round((finalScore / totalQuestions) * 100) : 0;

  const currentQuestion = module.quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  if (isQuizCompleted) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-primary"/>
            <CardTitle>Quiz Results: {module.title}</CardTitle>
          </div>
          <CardDescription>Here's how you did. Review your answers below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="text-center p-6 bg-secondary/50">
             <CardHeader className="p-0">
                <CardTitle className="text-2xl font-bold mb-2">
                {finalProgress >= 80 ? 'Excellent Work!' : 'Quiz Complete!'}
                </CardTitle>
                <CardDescription>This is your score card for this quiz attempt.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 mt-6 flex flex-col items-center">
                 <div className="relative h-32 w-32">
                    <svg className="h-full w-full" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200 dark:text-gray-700" strokeWidth="2"></circle>
                        <g className="origin-center -rotate-90 transform">
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-primary" strokeWidth="2" strokeDasharray={`${finalProgress}, 100`}></circle>
                        </g>
                    </svg>
                    <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
                        <span className="text-center text-2xl font-bold text-gray-800 dark:text-white">{finalProgress}%</span>
                    </div>
                </div>
                <p className="mt-4 text-lg">You scored <strong>{finalScore}</strong> out of <strong>{totalQuestions}</strong></p>
                <div className="flex justify-center gap-4 mt-6">
                <Button variant="outline" asChild>
                    <Link href="/learn">
                    Back to Modules
                    </Link>
                </Button>
                {finalProgress < 100 && (
                    <Button onClick={handleRetake}>
                    <RotateCw className="mr-2 h-4 w-4" />
                    Retake Quiz
                    </Button>
                )}
                </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Review Your Answers:</h3>
            {module.quiz.questions.map(q => {
                const userAnswer = selectedAnswers[q.id];
                const isCorrect = userAnswer === q.answer;
                
                return (
                    <Card key={q.id} className="p-4">
                        <p className="font-semibold mb-2">{q.text}</p>
                        {isCorrect ? (
                        <Alert variant="default" className="border-green-500 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-500/50">
                            <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                            <AlertTitle>Correct!</AlertTitle>
                            <AlertDescription>Your answer: <strong>{userAnswer}</strong></AlertDescription>
                        </Alert>
                        ) : (
                        <Alert variant="destructive">
                            <XCircle className="h-5 w-5" />
                            <AlertTitle>Incorrect</AlertTitle>
                            <AlertDescription>
                            Your answer: <strong>{userAnswer || 'Not answered'}</strong>.
                            <br />
                            Correct answer is: <strong>{q.answer}</strong>
                            </AlertDescription>
                        </Alert>
                        )}
                    </Card>
                )
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Award className="h-6 w-6 text-primary"/>
          <CardTitle>Quiz: {module.title}</CardTitle>
        </div>
        <CardDescription>Question {currentQuestionIndex + 1} of {totalQuestions}</CardDescription>
        <Progress value={((currentQuestionIndex + 1) / totalQuestions) * 100} className="h-2 mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="font-semibold mb-4 text-lg">{currentQuestion.text}</p>
          <RadioGroup
            value={selectedAnswers[currentQuestion.id] || ''}
            onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
          >
            {currentQuestion.options.map(opt => (
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-transparent hover:border-primary has-[:checked]:bg-primary/10 has-[:checked]:border-primary" key={opt}>
                <RadioGroupItem value={opt} id={`${currentQuestion.id}-${opt}`} />
                <Label htmlFor={`${currentQuestion.id}-${opt}`} className="flex-1 cursor-pointer">{opt}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between items-center">
          <Button 
            variant="outline"
            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>

          {isLastQuestion ? (
            <Button onClick={handleSubmit} disabled={Object.keys(selectedAnswers).length < totalQuestions}>
              Submit Answers <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => setCurrentQuestionIndex(prev => prev + 1)} disabled={!selectedAnswers[currentQuestion.id]}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
