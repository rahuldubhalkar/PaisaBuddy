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
} from 'lucide-react';
import { modules } from '@/lib/learning-modules-data';

export default function LearnPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Learning Modules</h1>
        <p className="text-muted-foreground">
          Bite-sized lessons to boost your financial knowledge. Complete quizzes
          to earn points!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => {
          const Icon = {
            PiggyBank,
            TrendingUp,
            Smartphone,
            Landmark,
            Gauge,
            HelpCircle,
          }[module.icon];

          return (
          <Card key={module.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  {Icon && <Icon className="h-6 w-6 text-primary" />}
                </div>
                <CardTitle>{module.title}</CardTitle>
              </div>
              <CardDescription className="pt-2">
                {module.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{module.progress}%</span>
              </div>
              <Progress value={module.progress} className="mt-2" />
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
        )})}
      </div>
    </div>
  );
}
