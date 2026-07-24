import { revalidateTag } from "next/cache";

/**
 * Algo Rich Cache Management
 * 
 * Provides a centralized way to handle cache invalidation.
 * Next.js 16 uses tags for fine-grained revalidation.
 * Note: revalidateTag in Next.js 16 requires a second `profile` argument.
 */

const DEFAULT_PROFILE = {};

/**
 * Invalidate user-specific data caches
 */
export async function invalidateUserCache(userId: string) {
  if (!userId) return;
  
  console.log(`[Cache] Invalidating cache for user: ${userId}`);
  
  // Revalidate generic user tags
  revalidateTag(`user-${userId}`, DEFAULT_PROFILE);
  revalidateTag(`user-${userId}-progress`, DEFAULT_PROFILE);
  revalidateTag(`user-${userId}-submissions`, DEFAULT_PROFILE);
  revalidateTag(`user-${userId}-stats`, DEFAULT_PROFILE);
}

/**
 * Invalidate global dashboard data
 */
export async function invalidateGlobalCache() {
  console.log(`[Cache] Invalidating global dashboard cache`);
  revalidateTag("global-dashboard-data", DEFAULT_PROFILE);
}
