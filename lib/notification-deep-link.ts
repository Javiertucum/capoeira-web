export type StoredDeepLink = {
  screen: string
  entityId?: string
  entityType?: string
}

export function toStoredDeepLink(
  deepLink: StoredDeepLink | undefined,
): StoredDeepLink | null {
  if (!deepLink) {
    return null
  }

  return {
    screen: deepLink.screen,
    ...(deepLink.entityId ? { entityId: deepLink.entityId } : {}),
    ...(deepLink.entityType ? { entityType: deepLink.entityType } : {}),
  }
}
