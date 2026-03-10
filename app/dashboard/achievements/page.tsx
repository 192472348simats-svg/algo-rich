import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AchievementsContent from "./AchievementsContent";

export default async function AchievementsPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  return <AchievementsContent />;
}
