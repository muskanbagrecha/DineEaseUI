import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="flex justify-center items-center">
      <div className="w-full max-w-md mx-auto mt-10 shadow-lg border border-gray-300 rounded-lg space-y-5 py-6">
        <Skeleton className="mx-auto w-40 h-7" />
        <Skeleton className="w-[80%] h-8 mx-auto" />
        <Skeleton className="w-[20%] h-7 ml-16" />
        <Skeleton className="w-[50%] h-8 ml-16" />
        <Skeleton className="w-[20%] h-7 ml-16" />
        <Skeleton className="w-[50%] h-8 ml-16" />
        <Skeleton className="w-[75%] h-8 mx-auto" />
      </div>
    </main>
  );
}
