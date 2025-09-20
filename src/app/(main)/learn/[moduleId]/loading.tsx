import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-9 w-1/2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1 flex flex-col gap-4">
          <Skeleton className="h-48 w-full" />
        </aside>
        <main className="md:col-span-3">
          <Skeleton className="h-96 w-full" />
        </main>
      </div>
    </div>
  );
}
