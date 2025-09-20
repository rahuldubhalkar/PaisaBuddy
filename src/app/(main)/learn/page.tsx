'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  PiggyBank,
  TrendingUp,
  Smartphone,
  Landmark,
  Gauge,
  HelpCircle,
  GraduationCap,
} from 'lucide-react';
import { useLearningModules } from '@/components/learning-modules-provider';

const icons: { [key: string]: React.ElementType } = {
  PiggyBank,
  TrendingUp,
  Smartphone,
  Landmark,
  Gauge,
  HelpCircle,
};

function OverallLearningProgress() {
  const { modules } = useLearningModules();
  const totalModules = modules.length;
  const totalProgress = modules.reduce((sum, module) => sum + module.progress, 0);
  const overallProgress = totalModules > 0 ? totalProgress / totalModules : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <GraduationCap className="h-6 w-6 text-primary" />
          <CardTitle>Overall Learning Progress</CardTitle>
        </div>
        <CardDescription>
          Your average progress across all modules.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={overallProgress} className="h-3" />
        <div className="mt-2 flex justify-between text-sm text-muted-foreground">
          <span>Average Progress</span>
          <span>{Math.round(overallProgress)}%</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LearnPage() {
  const { modules } = useLearningModules();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Learning Modules</h1>
        <p className="text-muted-foreground">
          Bite-sized lessons to boost your financial knowledge. Complete quizzes
          to earn points!
        </p>
      </div>

      <OverallLearningProgress />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => {
          const Icon = icons[module.icon as keyof typeof icons];

          return (
            <Card key={module.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    {Icon && <Icon className="h-6 w-6 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription className="pt-2">
                      {module.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                {module.progress > 0 && (
                  <>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Progress</span>
                      <span>{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="mt-2" />
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/learn/${module.id}`}>
                    {module.progress === 100
                      ? 'Review'
                      : module.progress > 0
                      ? 'Continue Learning'
                      : 'Start Learning'}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
