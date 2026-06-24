import 'server-only'

import type { DecodedIdToken } from 'firebase-admin/auth'

function getConfiguredAdminUids() {
  const values = [process.env.ADMIN_UID, process.env.ADMIN_UIDS]
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter(Boolean)

  return new Set(values)
}

/**
 * Solo la cuenta maestra tiene acceso al panel: via el custom claim
 * `superAdmin` (otorgado por setSuperAdminClaim / el script de bootstrap) o,
 * mientras el claim no se haya emitido aun, via el fallback de ADMIN_UID/
 * ADMIN_UIDS. Nunca se consulta Firestore aqui — esos campos son escribibles
 * por el propio usuario y no deben poder otorgar acceso al panel.
 */
export async function hasAdminAccess(decoded: DecodedIdToken): Promise<boolean> {
  if (!decoded?.uid) return false

  if (decoded.superAdmin === true) {
    return true
  }

  return getConfiguredAdminUids().has(decoded.uid)
}
