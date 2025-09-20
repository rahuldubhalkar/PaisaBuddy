import { ContentGenerator } from '@/components/content-generator';

export default function GeneratePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          India-Centric Content Generator
        </h1>
        <p className="text-muted-foreground">
          Use our AI tool to create relevant examples and scenarios for any
          financial concept, tailored for the Indian context.
        </p>
      </div>
      <ContentGenerator />
    </div>
  );
}
