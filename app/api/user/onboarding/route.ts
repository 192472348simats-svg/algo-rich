import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { onboardingCompleted: true },
    })

    return NextResponse.json({
      onboardingCompleted: user?.onboardingCompleted ?? false,
    })
  } catch (error) {
    console.error('Get onboarding status error:', error)
    return NextResponse.json(
      { error: 'Failed to get onboarding status' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        onboardingCompleted: body.completed ?? true,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update onboarding error:', error)
    return NextResponse.json(
      { error: 'Failed to update onboarding status' },
      { status: 500 }
    )
  }
}
