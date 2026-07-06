import { compareVersions, filterUserDocs } from '../notification-audience-filter'

const makeUser = (overrides: Record<string, unknown>) => ({
  id: 'uid1',
  fcmToken: 'token1',
  displayName: 'Test User',
  email: 'test@example.com',
  role: 'student',
  country: 'ES',
  groupId: 'g1',
  ...overrides,
})

describe('filterUserDocs', () => {
  it('includes all users when segment is empty', () => {
    const users = [makeUser({}), makeUser({ id: 'uid2', fcmToken: 'token2' })]
    expect(filterUserDocs(users, {})).toHaveLength(2)
  })

  it('excludes users without fcmToken', () => {
    const users = [makeUser({}), makeUser({ id: 'uid2', fcmToken: '' })]
    expect(filterUserDocs(users, {})).toHaveLength(1)
  })

  it('filters by role', () => {
    const users = [makeUser({ role: 'student' }), makeUser({ id: 'uid2', fcmToken: 'token2', role: 'educator' })]
    expect(filterUserDocs(users, { roles: ['educator'] })).toHaveLength(1)
    expect(filterUserDocs(users, { roles: ['educator'] })[0].uid).toBe('uid2')
  })

  it('filters by country', () => {
    const users = [makeUser({ country: 'ES' }), makeUser({ id: 'uid2', fcmToken: 'token2', country: 'AR' })]
    expect(filterUserDocs(users, { countries: ['AR'] })).toHaveLength(1)
  })

  it('filters by groupId', () => {
    const users = [
      makeUser({ groupId: 'g1' }),
      makeUser({ id: 'uid2', fcmToken: 'token2', groupId: 'g2' }),
      makeUser({ id: 'uid3', fcmToken: 'token3', groupId: null }),
    ]
    expect(filterUserDocs(users, { groupIds: ['g1'] })).toHaveLength(1)
  })

  it('includes ungrouped users when noGroup is true', () => {
    const users = [
      makeUser({ groupId: 'g1' }),
      makeUser({ id: 'uid2', fcmToken: 'token2', groupId: null }),
    ]
    expect(filterUserDocs(users, { noGroup: true })).toHaveLength(1)
    expect(filterUserDocs(users, { noGroup: true })[0].uid).toBe('uid2')
  })

  it('unions groupIds and noGroup', () => {
    const users = [
      makeUser({ groupId: 'g1' }),
      makeUser({ id: 'uid2', fcmToken: 'token2', groupId: 'g2' }),
      makeUser({ id: 'uid3', fcmToken: 'token3', groupId: null }),
    ]
    const result = filterUserDocs(users, { groupIds: ['g1'], noGroup: true })
    expect(result).toHaveLength(2)
    expect(result.map(r => r.uid)).toContain('uid1')
    expect(result.map(r => r.uid)).toContain('uid3')
  })

  it('filters by nucleoId', () => {
    const users = [
      makeUser({ nucleoIds: ['n1'] }),
      makeUser({ id: 'uid2', fcmToken: 'token2', groupId: 'g2', nucleoIds: ['n2'] }),
      makeUser({ id: 'uid3', fcmToken: 'token3', groupId: null, nucleoIds: [] }),
    ]
    const result = filterUserDocs(users, { nucleoIds: ['n1'] })
    expect(result).toHaveLength(1)
    expect(result[0].uid).toBe('uid1')
  })

  it('unions groupIds and nucleoIds independently of which group the nucleo belongs to', () => {
    const users = [
      makeUser({ groupId: 'g1', nucleoIds: [] }),
      makeUser({ id: 'uid2', fcmToken: 'token2', groupId: 'g2', nucleoIds: ['n2'] }),
      makeUser({ id: 'uid3', fcmToken: 'token3', groupId: 'g3', nucleoIds: [] }),
    ]
    const result = filterUserDocs(users, { groupIds: ['g1'], nucleoIds: ['n2'] })
    expect(result.map((r) => r.uid).sort()).toEqual(['uid1', 'uid2'])
  })

  it('unions individual userIds with base audience', () => {
    const users = [
      makeUser({ role: 'student' }),
      makeUser({ id: 'uid2', fcmToken: 'token2', role: 'educator' }),
    ]
    // Role filter would exclude uid2, but userIds overrides
    const result = filterUserDocs(users, { roles: ['student'], userIds: ['uid2'] })
    expect(result).toHaveLength(2)
  })

  it('deduplicates when user matches both base and userIds', () => {
    const users = [makeUser({})]
    const result = filterUserDocs(users, { userIds: ['uid1'] })
    expect(result).toHaveLength(1)
  })

  describe('compareVersions', () => {
    it('compares numerically, not lexicographically', () => {
      expect(compareVersions('3.0.9', '3.0.30')).toBeLessThan(0)
      expect(compareVersions('3.0.30', '3.0.9')).toBeGreaterThan(0)
      expect(compareVersions('3.0.30', '3.0.30')).toBe(0)
    })

    it('treats missing segments as 0', () => {
      expect(compareVersions('3.1', '3.1.0')).toBe(0)
      expect(compareVersions('3.1.1', '3.1')).toBeGreaterThan(0)
    })
  })

  it('filters by appVersions (exact match against one or more versions)', () => {
    const users = [
      makeUser({ appVersion: '3.0.29' }),
      makeUser({ id: 'uid2', fcmToken: 'token2', appVersion: '3.0.30' }),
      makeUser({ id: 'uid3', fcmToken: 'token3', appVersion: '3.1.0' }),
    ]
    const result = filterUserDocs(users, { appVersions: ['3.0.30', '3.1.0'] })
    expect(result.map((r) => r.uid).sort()).toEqual(['uid2', 'uid3'])
  })

  it('excludes users without a registered appVersion when a version filter is set', () => {
    const users = [
      makeUser({ appVersion: '3.0.30' }),
      makeUser({ id: 'uid2', fcmToken: 'token2', appVersion: undefined }),
    ]
    const result = filterUserDocs(users, { appVersions: ['3.0.30'] })
    expect(result.map((r) => r.uid)).toEqual(['uid1'])
  })
})
