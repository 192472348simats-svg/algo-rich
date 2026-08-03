import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

const EXPERIENCE_PHASE: Record<string, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { experience, goal, phase, targetInterviewDate } = body
    const normalizedExperience = typeof experience === 'string' && EXPERIENCE_PHASE[experience]
      ? experience
      : 'beginner'
    const currentPhase = typeof phase === 'number'
      ? Math.max(1, Math.min(5, phase))
      : EXPERIENCE_PHASE[normalizedExperience]
    const normalizedGoal = typeof goal === 'string' && goal.trim() ? goal.trim() : 'learn'

    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          onboardingCompleted: true,
          experienceLevel: normalizedExperience,
          learningGoal: normalizedGoal,
          currentPhase,
          ...(targetInterviewDate && { targetInterviewDate: new Date(targetInterviewDate) }),
        },
      }),
      prisma.userPreferences.upsert({
        where: { userId: session.user.id },
        update: {
          experienceLevel: normalizedExperience,
          learningGoal: normalizedGoal,
          onboardingDone: true,
        },
        create: {
          userId: session.user.id,
          experienceLevel: normalizedExperience,
          learningGoal: normalizedGoal,
          onboardingDone: true,
        },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Onboarding complete error:', error)
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    )
  }
}
