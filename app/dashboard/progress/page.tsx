import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProgressDashboard from "./ProgressDashboard";

export const dynamic = 'force-dynamic'


export default async function ProgressPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  return <ProgressDashboard userName={session.user.name || "Student"} />;
}
