import {
  StatCardSkeleton,
  CourseCardSkeleton,
  LessonSkeleton,
  ProblemListSkeleton,
} from "./Skeleton";

interface ContentLoaderProps {
  type: "dashboard" | "lesson" | "problem" | "course";
}

/** Type-aware skeleton layout for different page types */
export default function ContentLoader({ type }: ContentLoaderProps) {
  if (type === "dashboard") {
    return (
      <div className="max-w-6xl mx-auto pt-8 lg:pt-0 animate-pulse">
        {/* Heading skeleton */}
        <div className="mb-8">
          <div className="h-8 w-64 bg-white/5 rounded-lg mb-2" />
          <div className="h-4 w-48 bg-white/5 rounded" />
        </div>
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        {/* Course cards */}
        <div className="h-6 w-32 bg-white/5 rounded mb-5" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
        </div>
      </div>
    );
  }

  if (type === "lesson") {
    return (
      <div className="max-w-7xl mx-auto pt-8 lg:pt-0">
        <LessonSkeleton />
      </div>
    );
  }

  if (type === "problem") {
    return (
      <div className="max-w-7xl mx-auto pt-8 lg:pt-0">
        <ProblemListSkeleton />
      </div>
    );
  }

  // course
  return (
    <div className="max-w-6xl mx-auto pt-8 lg:pt-0 animate-pulse">
      <div className="h-8 w-48 bg-white/5 rounded-lg mb-3" />
      <div className="h-4 w-80 bg-white/5 rounded mb-8" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-20 bg-white/5 rounded-xl border border-white/5"
          />
        ))}
      </div>
    </div>
  );
}
