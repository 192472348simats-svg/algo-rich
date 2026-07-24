import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SessionPlayer from "./SessionPlayer";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ sessionSlug: string }>;
}

export default async function SessionPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  const { sessionSlug } = await params;

  return (
    <ErrorBoundary componentName="SessionPlayer">
      <SessionPlayer sessionSlug={sessionSlug} />
    </ErrorBoundary>
  );
}
