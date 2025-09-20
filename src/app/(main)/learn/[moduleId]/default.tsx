'use client';

import { notFound, useParams } from 'next/navigation';
import { modules } from '@/lib/learning-modules-data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export default function ModuleLessonsPage() {
  const params = useParams();
  const { moduleId } = params;
  const module = modules.find((m) => m.id === moduleId);

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
              <AccordionContent className="prose prose-sm max-w-none">
                <p>{lesson.content}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
