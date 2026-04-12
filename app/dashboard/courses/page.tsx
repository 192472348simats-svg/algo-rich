import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import CoursesListContent from "./CoursesListContent";

export const dynamic = 'force-dynamic'


export default async function CoursesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const userId = session.user.id;

  const [dbCourses, completedProgress] = await Promise.all([
    prisma.course.findMany({
      orderBy: { order: "asc" },
      include: { lessons: { select: { id: true }, orderBy: { order: "asc" } } },
    }),
    prisma.progress.findMany({
      where: { userId, completed: true },
      select: { lessonId: true },
    }),
  ]);

  const completedIds = new Set(completedProgress.map((p) => p.lessonId));

  const courses = dbCourses.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    description: c.description,
    icon: c.icon,
    difficulty: c.difficulty,
    totalLessons: c.lessons.length,
    completedLessons: c.lessons.filter((l) => completedIds.has(l.id)).length,
    href: `/dashboard/courses/${c.id}`,
  }));

  // Safety dedup
  const unique = courses.filter(
    (c, i, self) => i === self.findIndex((o) => o.title === c.title)
  );

  return <CoursesListContent courses={unique} />;
}
