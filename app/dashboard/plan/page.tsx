import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import PlanFlow from "./PlanFlow";

export const dynamic = 'force-dynamic'


export default async function PlanPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  return <PlanFlow userId={session.user.id!} />;
}
