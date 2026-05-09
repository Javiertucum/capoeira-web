export interface OnboardingUser {
  avatarUrl?: string | null
  groupId?: string | null
  graduationLevelId?: string | null
  country?: string | null
  bio?: string | null
}

export function computeOnboardingProgress(user: OnboardingUser): number {
  const steps = [
    Boolean(user.avatarUrl),
    Boolean(user.groupId),
    Boolean(user.graduationLevelId),
    Boolean(user.country),
    Boolean(user.bio),
  ]
  return Math.round((steps.filter(Boolean).length / steps.length) * 100)
}
