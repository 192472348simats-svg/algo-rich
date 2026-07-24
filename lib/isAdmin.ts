import { auth } from "@/lib/auth";

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminEmails = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL;
  if (!adminEmails) return false;
  
  const allowedEmails = adminEmails.split(",").map((e) => e.trim().toLowerCase());
  return allowedEmails.includes(email.toLowerCase());
}

/**
 * Checks if the current request is from an authorized admin.
 * Uses environment variable ADMIN_EMAIL for zero-migration role management.
 */
export async function isAdminRequest(): Promise<boolean> {
  const session = await auth();
  return isAdmin(session?.user?.email);
}
