import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ReviewQueue from "./ReviewQueue";

export default async function ReviewPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  return <ReviewQueue userId={session.user.id} />;
}
