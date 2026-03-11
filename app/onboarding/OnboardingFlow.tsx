'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

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
      await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experience,
          goal,
          targetInterviewDate: targetInterviewDate || null,
        }),
      })
      router.push('/dashboard')
    } catch (error) {
      console.error('Onboarding error:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalSteps = 3

  return (
    <div className="min-h-screen bg-[#0A1128] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-2 w-12 rounded-full transition-colors ${
                i <= step ? 'bg-[#D4AF37]' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>

        {step === 0 && (
          <>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">Welcome, {userName}! 🎉</h1>
              <p className="text-gray-400 mt-2">Let&apos;s personalize your learning experience.</p>
            </div>
            <div className="space-y-4 mt-8">
              <p className="text-gray-300">What&apos;s your programming experience level?</p>
              <div className="grid gap-3">
                {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                  <button
                    key={level}
                    onClick={() => { setExperience(level.toLowerCase()); setStep(1) }}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      experience === level.toLowerCase()
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                        : 'border-gray-600 text-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">What&apos;s your goal?</h1>
              <p className="text-gray-400 mt-2">This helps us create your personalized plan.</p>
            </div>
            <div className="space-y-4 mt-8">
              <div className="grid gap-3">
                {[
                  { value: 'interview', label: '💼 Prepare for tech interviews' },
                  { value: 'learn', label: '📚 Learn DSA fundamentals' },
                  { value: 'compete', label: '🏆 Competitive programming' },
                  { value: 'refresh', label: '🔄 Refresh my skills' },
                ].map((g) => (
                  <button
                    key={g.value}
                    onClick={() => { setGoal(g.value); setStep(2) }}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      goal === g.value
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                        : 'border-gray-600 text-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">You&apos;re all set! 🚀</h1>
              <p className="text-gray-400 mt-2">Your personalized plan is ready.</p>
            </div>
            <div className="space-y-6 mt-8">
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  When is your target interview date? <span className="text-gray-500">(optional)</span>
                </label>
                <input
                  type="date"
                  value={targetInterviewDate}
                  onChange={(e) => setTargetInterviewDate(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-600 bg-[#0A1128] text-gray-300 focus:border-[#D4AF37] focus:outline-none transition-colors"
                />
              </div>
              <div className="text-center">
                <p className="text-gray-300 mb-4">
                  We&apos;ve customized your learning path based on your preferences.
                </p>
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className="px-8 py-3 bg-[#D4AF37] text-[#0A1128] rounded-lg font-semibold hover:bg-[#F4E4C1] transition-colors disabled:opacity-50"
                >
                  {loading ? 'Setting up...' : 'Start Learning →'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
