import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsContent from "./SettingsContent";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  return (
    <SettingsContent
      userName={session.user.name || ""}
      userEmail={session.user.email || ""}
    />
  );
}
