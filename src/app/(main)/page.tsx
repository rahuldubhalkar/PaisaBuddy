'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CandlestickChart,
  GraduationCap,
  ShieldAlert,
  Wallet,
  LogIn,
  UserPlus
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLearningModules } from '@/components/learning-modules-provider';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/components/auth-provider';

const features = [
  {
    title: 'Virtual Portfolio',
    description:
      'Invest virtual money in real Indian stocks and mutual funds. Learn market dynamics risk-free.',
    href: '/portfolio',
    icon: CandlestickChart,
    imgId: 'dashboard-portfolio',
  },
  {
    title: 'Learning Modules',
    description:
      'Bite-sized lessons on budgeting, SIPs, UPI, taxes, and credit scores with interactive quizzes.',
    href: '/learn',
    icon: GraduationCap,
    imgId: 'dashboard-learn',
  },
  {
    title: 'Budgeting Tools',
    description:
      'Track your income, categorize expenses, and set personalized financial goals with intuitive tools.',
    href: '/budget',
    icon: Wallet,
    imgId: 'dashboard-budget',
  },
  {
    title: 'Fraud Identification',
    description:
      'Train yourself to identify and avoid common digital financial scams with realistic challenges.',
    href: '/fraud-detection',
    icon: ShieldAlert,
    imgId: 'dashboard-fraud',
  },
];

function LearningProgress() {
  const { modules } = useLearningModules();
  const totalModules = modules.length;
  const completedModules = modules.filter(m => m.progress === 100).length;
  const totalProgress = modules.reduce((sum, module) => sum + module.progress, 0);
  const overallProgress = totalModules > 0 ? totalProgress / totalModules : 0;

  return (
     <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <div className="flex items-center gap-3">
             <GraduationCap className="h-6 w-6 text-primary" />
             <CardTitle>Your Learning Progress</CardTitle>
          </div>
          <CardDescription>You have completed {completedModules} of {totalModules} modules.</CardDescription>
        </CardHeader>
        <CardContent>
            <Progress value={overallProgress} className="h-3" />
            <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                <span>Overall Progress</span>
                <span>{Math.round(overallProgress)}%</span>
            </div>
        </CardContent>
        <CardFooter>
            <Button asChild variant="outline">
                <Link href="/learn">
                    {completedModules === totalModules ? 'Review Modules' : 'Continue Learning'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </CardFooter>
     </Card>
  )
}

function WelcomeSection() {
    const { user } = useAuth();
    
    return (
         <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome {user ? user.displayName?.split(' ')[0] || 'back' : 'to Paisa Buddy'}!
            </h1>
            <p className="text-muted-foreground">
              Your journey to financial freedom starts here. Explore our tools and
              resources.
            </p>
         </div>
    )
}

function AuthCallToAction() {
  return (
    <Card className="col-span-1 md:col-span-2 bg-primary/10 border-primary">
      <CardHeader>
        <CardTitle>Join Paisa Buddy</CardTitle>
        <CardDescription>Create an account to save your progress, build your virtual portfolio, and track your achievements.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="w-full sm:w-auto">
          <Link href="/signup">
            <UserPlus className="mr-2 h-4 w-4" />
            Create Account
          </Link>
        </Button>
         <Button asChild variant="secondary" className="w-full sm:w-auto">
          <Link href="/login">
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-8">
      <WelcomeSection />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user ? <LearningProgress /> : <AuthCallToAction />}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {features.map((feature) => {
          const placeholder = PlaceHolderImages.find(p => p.id === feature.imgId);
          return (
            <Card key={feature.title} className="flex flex-col overflow-hidden">
               {placeholder && (
                <div className="overflow-hidden">
                  <Image
                    src={placeholder.imageUrl}
                    alt={placeholder.description}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover aspect-[3/2] transition-transform hover:scale-105"
                    data-ai-hint={placeholder.imageHint}
                  />
                </div>
              )}
              <CardHeader className="flex-grow">
                <div className="flex items-center gap-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                  <CardTitle>{feature.title}</CardTitle>
                </div>
                <CardDescription className="pt-2">{feature.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={feature.href}>
                    Explore Now <ArrowRight className="ml-2 h-4 w-4" />
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
