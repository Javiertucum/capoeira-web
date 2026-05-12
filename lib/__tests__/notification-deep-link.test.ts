import { toStoredDeepLink } from '../notification-deep-link'

describe('toStoredDeepLink', () => {
  it('omits undefined nested fields before persisting', () => {
    expect(
      toStoredDeepLink({
        screen: 'events',
        entityId: undefined,
        entityType: undefined,
      }),
    ).toEqual({
      screen: 'events',
    })
  })
})
