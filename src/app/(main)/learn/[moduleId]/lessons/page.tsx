'use client';

import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useLearningModules } from '@/components/learning-modules-provider';
import { Button } from '@/components/ui/button';

export default function ModuleLessonsPage() {
  const params = useParams();
  const { moduleId } = params;
  const { getModuleById } = useLearningModules();
  
  const module = getModuleById(moduleId as string);

  if (!module || !module.lessons) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary"/>
            <CardTitle>Lessons</CardTitle>
        </div>
        <CardDescription>
          Read through the lessons to prepare for the quiz.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue={module.lessons[0]?.id}>
          {module.lessons.map((lesson) => (
            <AccordionItem value={lesson.id} key={lesson.id}>
              <AccordionTrigger className="text-base">{lesson.title}</AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none text-card-foreground/80 space-y-4">
                {lesson.content.split('\\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
       <CardFooter>
        <Button asChild>
          <Link href={`/learn/${moduleId}/quiz`}>
            Start Quiz <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
