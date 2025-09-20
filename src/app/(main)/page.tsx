import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CandlestickChart,
  GraduationCap,
  ShieldAlert,
  Wallet,
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to Paisa Pathshala
        </h1>
        <p className="text-muted-foreground">
          Your journey to financial freedom starts here. Explore our tools and
          resources.
        </p>
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
