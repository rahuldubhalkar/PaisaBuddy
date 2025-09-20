'use client';

import { notFound, useParams, usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Award, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLearningModules } from '@/components/learning-modules-provider';
import React, { useEffect } from 'react';

export default function ModuleDetailsPage({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const { moduleId } = params;
  const { getModuleById } = useLearningModules();
  
  const module = getModuleById(moduleId as string);

  useEffect(() => {
    // If the base route is hit, redirect to lessons page.
    if (pathname === `/learn/${moduleId}`) {
      router.replace(`/learn/${moduleId}/lessons`);
    }
  }, [pathname, moduleId, router]);
  
  if (!module) {
    notFound();
  }
  
  // While redirecting, show nothing or a loading spinner
  if (pathname === `/learn/${moduleId}`) {
    return null; 
  }

  const isQuizPage = pathname.includes('/quiz');
  const isLessonsPage = pathname.includes('/lessons');

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/learn">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{module.title}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Module Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="flex flex-col gap-2">
                 <Button variant={isLessonsPage ? 'secondary' : 'ghost'} asChild className="justify-start">
                  <Link href={`/learn/${moduleId}/lessons`}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Lessons
                  </Link>
                </Button>
                 <Button variant={isQuizPage ? 'secondary' : 'ghost'} asChild className="justify-start">
                  <Link href={`/learn/${moduleId}/quiz`}>
                    <Award className="mr-2 h-4 w-4" />
                    Quiz
                  </Link>
                </Button>
              </nav>
            </CardContent>
          </Card>
        </aside>
        <main className="md:col-span-3">
          {children}
        </main>
      </div>
    </div>
  );
}
