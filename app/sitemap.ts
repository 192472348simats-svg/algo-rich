import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

// Sitemap content depends on the production database. Do not run these queries
// during `next build`, where a database may intentionally be unavailable.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://algo-rich.com'

  const routes = [
    '',
    '/dashboard',
    '/dashboard/practice',
    '/dashboard/lessons',
    '/dashboard/course',
    '/dashboard/visualize',
    '/signin',
    '/signup',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  try {
    const [problems, lessons] = await Promise.all([
      prisma.problem.findMany({
        where: { isActive: true },
        select: { id: true, updatedAt: true },
      }),
      prisma.lesson.findMany({ select: { slug: true } }),
    ])

    const problemRoutes = problems.map((problem) => ({
      url: `${baseUrl}/dashboard/practice/${problem.id}`,
      lastModified: problem.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
    const lessonRoutes = lessons.map((lesson) => ({
      url: `${baseUrl}/dashboard/lessons/${lesson.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [...routes, ...problemRoutes, ...lessonRoutes]
  } catch (error) {
    console.warn('[sitemap] Database unavailable; serving static routes only.', error instanceof Error ? error.message : error)
    return routes
  }
}
