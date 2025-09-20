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

const modules = [
  {
    title: 'Budgeting 101',
    description: 'Master the art of creating and sticking to a budget. Take control of your money.',
    icon: PiggyBank,
    progress: 75,
    status: 'In Progress',
  },
  {
    title: 'Power of SIPs',
    description: 'Understand Systematic Investment Plans and how they help in wealth creation.',
    icon: TrendingUp,
    progress: 40,
    status: 'In Progress',
  },
  {
    title: 'UPI & Digital Payments',
    description: 'Learn the ins and outs of UPI, wallets, and secure online transactions.',
    icon: Smartphone,
    progress: 100,
    status: 'Completed',
  },
  {
    title: 'Decoding Indian Taxes',
    description: 'A simple guide to understanding income tax, slabs, and deductions for salaried individuals.',
    icon: Landmark,
    progress: 0,
    status: 'Start Learning',
  },
  {
    title: 'Credit Score Explained',
    description: 'Why your CIBIL score matters and how to build a strong credit history.',
    icon: Gauge,
    progress: 0,
    status: 'Start Learning',
  },
  {
    title: 'Intro to Mutual Funds',
    description: 'Demystify mutual funds, their types, and how to choose the right one for you.',
    icon: HelpCircle,
    progress: 20,
    status: 'In Progress',
  },
];

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
        {modules.map((module) => (
          <Card key={module.title} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <module.icon className="h-6 w-6 text-primary" />
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
              <Button className="w-full">
                {module.progress === 100
                  ? 'Review'
                  : module.progress > 0
                  ? 'Continue Learning'
                  : 'Start Learning'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
