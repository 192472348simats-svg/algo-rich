import { auth } from "@/lib/auth";

/**
 * Checks if the current request is from an authorized admin.
 * Uses environment variable ADMIN_EMAIL for zero-migration role management.
 */
export async function isAdminRequest(): Promise<boolean> {
  const session = await auth();
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail || !session?.user?.email) {
    return false;
  }

  // Support single email or comma-separated list
  const allowedEmails = adminEmail.split(",").map((e) => e.trim().toLowerCase());
  return allowedEmails.includes(session.user.email.toLowerCase());
}
