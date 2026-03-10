"use client";

interface SkeletonProps {
  className?: string;
}

/** Shimmer skeleton loader for loading states. */
export default function Skeleton({ className = "h-4 w-full" }: SkeletonProps) {
  return (
    <div
      className={`rounded-lg skeleton-shimmer ${className}`}
      aria-hidden="true"
    />
  );
}

/** Preset skeleton for a stat card. */
export function StatCardSkeleton() {
  return (
    <div className="bg-[var(--glass-bg)] border border-border rounded-xl p-5 space-y-3">
      <Skeleton className="h-6 w-6 rounded-full" />
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

/** Preset skeleton for a course card. */
export function CourseCardSkeleton() {
  return (
    <div className="bg-[var(--glass-bg)] border border-border rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-5 w-36" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-2 w-full rounded-full" />
      <Skeleton className="h-9 w-full rounded-lg" />
    </div>
  );
}

/** Preset skeleton for lesson content. */
export function LessonSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-9 w-80" />
      </div>
      <div className="bg-[var(--glass-bg)] border border-border rounded-xl p-8 space-y-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-11/12" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-9/12" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-10/12" />
      </div>
    </div>
  );
}

/** Preset skeleton for problem list. */
export function ProblemListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="bg-[var(--glass-bg)] border border-border rounded-xl p-4 flex items-center gap-4"
        >
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}
