// REDESIGNED v2: Navy+gold theme, gold selection state, split layout, redirect to first lesson
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { analytics } from '@/lib/analytics'

export default function OnboardingFlow({ userName }: { userName: string }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [experience, setExperience] = useState('')
  const [goal, setGoal] = useState('')
  const [targetInterviewDate, setTargetInterviewDate] = useState('')
  const [loading, setLoading] = useState(false)

  const handleComplete = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experience, goal, targetInterviewDate: targetInterviewDate || null }),
      })
      if (!response.ok) throw new Error('Failed to complete onboarding')
      analytics.track('onboarding_completed', {
        experience_level: experience || 'beginner',
        learning_goal: goal || 'learn',
        has_target_interview_date: Boolean(targetInterviewDate),
      })
      try {
        const res = await fetch('/api/recommendations')
        const data = await res.json()
        const firstLesson = data?.recommendations?.find(
          (r: { type: string; href: string }) => r.type === 'lesson'
        )
        if (firstLesson?.href) { router.push(firstLesson.href); return }
      } catch { /* fall through */ }
      router.push('/dashboard')
    } catch (error) {
      console.error('Onboarding error:', error)
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const totalSteps = 3
  const levelOptions = [
    { value: 'beginner', label: 'Beginner', desc: "I'm new to programming or just starting with Python" },
    { value: 'intermediate', label: 'Intermediate', desc: "I know Python basics but haven't studied DSA seriously" },
    { value: 'advanced', label: 'Advanced', desc: "I know DSA fundamentals and want to sharpen for interviews" },
  ]
  const goalOptions = [
    { value: 'interview', abbr: 'IN', label: 'Prepare for tech interviews' },
    { value: 'learn', abbr: 'DS', label: 'Learn DSA fundamentals' },
    { value: 'compete', abbr: 'CP', label: 'Competitive programming' },
    { value: 'refresh', abbr: 'RF', label: 'Refresh my skills' },
  ]

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0f24' }}>
      <div className="hidden lg:flex flex-col justify-between w-80 p-10 flex-shrink-0" style={{ borderRight: '1px solid #1E3A5F' }}>
        <div>
          <h2 className="text-lg font-bold mb-1" style={{ color: '#E5A829' }}>Algo Rich</h2>
          <p className="text-sm" style={{ color: '#6b7a99' }}>Your DSA learning path</p>
        </div>
        <div className="space-y-4">
          {['Your level', 'Your goal', 'Target date'].map((label, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                style={{ background: i < step ? '#10b981' : i === step ? '#E5A829' : 'transparent', color: i <= step ? '#0a0f24' : '#6b7a99', border: i > step ? '1px solid #1E3A5F' : 'none' }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className="text-sm" style={{ color: i === step ? '#fff' : '#6b7a99' }}>{label}</span>
            </div>
          ))}
        </div>
        <div className="text-xs" style={{ color: '#6b7a99' }}>Takes about 30 seconds</div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-lg relative">
          <div className="absolute -top-8 -left-4 font-bold select-none pointer-events-none" style={{ fontSize: '120px', lineHeight: 1, color: '#1E3A5F', zIndex: 0 }}>
            0{step + 1}
          </div>
          <div className="relative z-10">
            <div className="flex gap-2 mb-8 lg:hidden">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className="h-1 w-10 rounded-full transition-all duration-300" style={{ background: i <= step ? '#E5A829' : '#1E3A5F' }} />
              ))}
            </div>

            {step === 0 && (
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: '#E5A829' }}>Step 1 of 3</p>
                <h1 className="text-3xl font-bold text-white mb-2" style={{ letterSpacing: '-0.02em' }}>Where are you right now?</h1>
                <p className="mb-8" style={{ color: '#6b7a99' }}>Welcome, {userName}. This helps us set the right starting point.</p>
                <div className="space-y-3">
                  {levelOptions.map((opt) => (
                    <button key={opt.value} onClick={() => { setExperience(opt.value); setStep(1) }}
                      className="w-full p-4 rounded-xl text-left transition-all duration-200"
                      style={{ background: experience === opt.value ? '#1a1400' : '#0f1629', border: `1px solid ${experience === opt.value ? '#E5A829' : '#1E3A5F'}` }}
                      onMouseEnter={e => { if (experience !== opt.value) (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5A82950' }}
                      onMouseLeave={e => { if (experience !== opt.value) (e.currentTarget as HTMLButtonElement).style.borderColor = '#1E3A5F' }}>
                      <div className="font-semibold text-white text-sm mb-0.5">{opt.label}</div>
                      <div className="text-xs" style={{ color: '#6b7a99' }}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: '#E5A829' }}>Step 2 of 3</p>
                <h1 className="text-3xl font-bold text-white mb-2" style={{ letterSpacing: '-0.02em' }}>What do you want to achieve?</h1>
                <p className="mb-8" style={{ color: '#6b7a99' }}>We&apos;ll weight your curriculum around your primary goal.</p>
                <div className="space-y-3">
                  {goalOptions.map((opt) => (
                    <button key={opt.value} onClick={() => { setGoal(opt.value); setStep(2) }}
                      className="w-full p-4 rounded-xl text-left transition-all duration-200 flex items-center gap-4"
                      style={{ background: goal === opt.value ? '#1a1400' : '#0f1629', border: `1px solid ${goal === opt.value ? '#E5A829' : '#1E3A5F'}` }}
                      onMouseEnter={e => { if (goal !== opt.value) (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5A82950' }}
                      onMouseLeave={e => { if (goal !== opt.value) (e.currentTarget as HTMLButtonElement).style.borderColor = '#1E3A5F' }}>
                      <span className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: '#1a1400', color: '#E5A829', border: '1px solid #E5A82930' }}>{opt.abbr}</span>
                      <span className="font-medium text-sm text-white">{opt.label}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep(0)} className="mt-4 text-sm" style={{ color: '#6b7a99' }}>← Back</button>
              </div>
            )}

            {step === 2 && (
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: '#E5A829' }}>Step 3 of 3</p>
                <h1 className="text-3xl font-bold text-white mb-2" style={{ letterSpacing: '-0.02em' }}>When is your target interview?</h1>
                <p className="mb-8" style={{ color: '#6b7a99' }}>Optional. We&apos;ll pace your plan to hit this date.</p>
                <div className="space-y-6">
                  <input type="date" value={targetInterviewDate} onChange={(e) => setTargetInterviewDate(e.target.value)}
                    className="w-full p-3.5 rounded-xl text-white focus:outline-none transition-colors"
                    style={{ background: '#0f1629', border: '1px solid #1E3A5F', colorScheme: 'dark' }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#E5A829')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#1E3A5F')} />
                  <div className="space-y-3">
                    <button onClick={handleComplete} disabled={loading}
                      className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-50"
                      style={{ background: '#E5A829', color: '#0a0f24' }}>
                      {loading ? 'Setting up your plan...' : 'Start learning →'}
                    </button>
                    <button onClick={handleComplete} disabled={loading} className="w-full py-2 text-sm" style={{ color: '#6b7a99' }}>
                      Skip for now
                    </button>
                  </div>
                </div>
                <button onClick={() => setStep(1)} className="mt-4 text-sm" style={{ color: '#6b7a99' }}>← Back</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}