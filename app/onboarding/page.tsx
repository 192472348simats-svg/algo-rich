import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import OnboardingFlow from './OnboardingFlow'

export default async function OnboardingPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/signin')
  }

  return <OnboardingFlow userName={session.user.name ?? 'there'} />
}
