import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import OnboardingFlow from './OnboardingFlow'
import prisma from '@/lib/prisma'

export default async function OnboardingPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/signin')
  }

  // Check if onboarding is already completed
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingCompleted: true }
  })

  if (user?.onboardingCompleted) {
    redirect('/dashboard')
  }

  return <OnboardingFlow userName={session.user.name ?? 'there'} />
}
