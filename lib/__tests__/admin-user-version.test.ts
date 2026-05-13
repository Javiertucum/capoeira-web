import { resolveAdminUserAppVersion } from '../admin-user-version'

describe('resolveAdminUserAppVersion', () => {
  it('prefers the public document app version', () => {
    expect(
      resolveAdminUserAppVersion(
        { appVersion: '2.6.1' },
        { appVersion: '2.5.9' },
      ),
    ).toBe('2.6.1')
  })

  it('falls back to the private document app version', () => {
    expect(
      resolveAdminUserAppVersion(
        {},
        { appVersion: '2.5.9' },
      ),
    ).toBe('2.5.9')
  })

  it('returns an empty string when neither document has an app version', () => {
    expect(resolveAdminUserAppVersion({}, {})).toBe('')
  })
})
