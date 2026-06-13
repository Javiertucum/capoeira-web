import 'server-only'
import { getMessaging } from 'firebase-admin/messaging'
import { adminApp, adminDb } from './firebase-admin'

/** Sends a single push notification to a user via their stored FCM token. Returns false if no token or send fails. */
export async function sendPushToUser(
  uid: string,
  title: string,
  body: string,
  data?: Record<string, string>,
): Promise<boolean> {
  const userDoc = await adminDb.collection('users').doc(uid).get()
  const token = userDoc.data()?.fcmToken as string | undefined
  if (!token) return false

  try {
    await getMessaging(adminApp).send({
      token,
      notification: { title, body },
      data,
      android: { priority: 'high', notification: { channelId: 'default', sound: 'default' } },
      apns: { payload: { aps: { sound: 'default' } } },
    })
    return true
  } catch (error) {
    console.error('[sendPushToUser] failed:', error)
    return false
  }
}
