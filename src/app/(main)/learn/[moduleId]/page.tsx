'use client';

import { notFound, useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { modules } from '@/lib/learning-modules-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Award, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ModuleDetailsPage({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const { moduleId } = params;
  
  const module = modules.find((m) => m.id === moduleId);

  if (!module) {
    notFound();
  }

  const isQuizPage = pathname.includes('/quiz');

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
                 <Button variant={!isQuizPage ? 'secondary' : 'ghost'} asChild className="justify-start">
                  <Link href={`/learn/${moduleId}`}>
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
