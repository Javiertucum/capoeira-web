const CANCELLABLE_STATUSES = new Set(['queued', 'scheduled', 'processing'])
const EXPEDITE_STATUSES = new Set(['scheduled'])

export function getNotificationCampaignActionAvailability(status: string) {
  return {
    canCancel: CANCELLABLE_STATUSES.has(status),
    canExpedite: EXPEDITE_STATUSES.has(status),
  }
}
