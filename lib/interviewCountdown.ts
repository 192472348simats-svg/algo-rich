export function getCountdownData(targetDate: Date | null): {
  daysLeft: number | null
  message: string
  urgency: 'none' | 'comfortable' | 'tight' | 'urgent'
} {
  if (!targetDate) return { daysLeft: null, message: 'No interview date set', urgency: 'none' }
  const daysLeft = Math.ceil((targetDate.getTime() - Date.now()) / 86400000)
  if (daysLeft < 0) return { daysLeft: 0, message: 'Interview date passed', urgency: 'urgent' }
  if (daysLeft <= 14) return { daysLeft, message: `${daysLeft} days to interview — final push!`, urgency: 'urgent' }
  if (daysLeft <= 30) return { daysLeft, message: `${daysLeft} days — stay consistent`, urgency: 'tight' }
  return { daysLeft, message: `${daysLeft} days — you have time, use it well`, urgency: 'comfortable' }
}
