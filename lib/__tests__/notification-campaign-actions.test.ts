import { getNotificationCampaignActionAvailability } from '../notification-campaign-actions'

describe('getNotificationCampaignActionAvailability', () => {
  it('allows expediting and cancelling scheduled campaigns', () => {
    expect(getNotificationCampaignActionAvailability('scheduled')).toEqual({
      canCancel: true,
      canExpedite: true,
    })
  })

  it('allows cancelling queued campaigns but not expediting them', () => {
    expect(getNotificationCampaignActionAvailability('queued')).toEqual({
      canCancel: true,
      canExpedite: false,
    })
  })

  it('disables both actions for sent campaigns', () => {
    expect(getNotificationCampaignActionAvailability('sent')).toEqual({
      canCancel: false,
      canExpedite: false,
    })
  })
})
