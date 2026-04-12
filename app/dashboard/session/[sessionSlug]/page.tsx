import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SessionPlayer from "./SessionPlayer";

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ sessionSlug: string }>;
}

export default async function SessionPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  const { sessionSlug } = await params;

  return <SessionPlayer sessionSlug={sessionSlug} />;
}
