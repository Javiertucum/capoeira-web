import 'server-only'
import { adminDb } from './firebase-admin'
import { sendPushToUser } from './notification-send'

/**
 * Notifica al admin del grupo que su sistema de graduaciones fue creado o
 * modificado desde el panel web, invitándolo a revisarlo. El deep link
 * (screen: 'graduation', entityId: groupId) abre el editor de graduaciones
 * del grupo en la app (ver notificationRouting.ts en capoeira-app).
 * Best-effort: nunca bloquea la operación principal.
 */
export async function notifyGroupAdminGraduationChange(
  groupId: string,
  action: 'created' | 'updated',
  levelName: string,
): Promise<void> {
  try {
    const groupDoc = await adminDb.collection('groups').doc(groupId).get()
    const adminUserId = groupDoc.data()?.adminUserId as string | undefined
    if (!adminUserId) return

    const title = action === 'created' ? 'Nueva graduación en tu grupo' : 'Graduación actualizada'
    const body =
      action === 'created'
        ? `Se creó el nivel "${levelName}" en tu sistema de graduaciones. Revísalo y corrígelo si es necesario.`
        : `Se actualizó el nivel "${levelName}" en tu sistema de graduaciones. Revísalo y corrígelo si es necesario.`

    await sendPushToUser(adminUserId, title, body, {
      screen: 'graduation',
      entityId: groupId,
    })
  } catch (error) {
    console.error('[notifyGroupAdminGraduationChange] failed:', error)
  }
}
