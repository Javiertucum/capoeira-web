/**
 * Google Consent Mode v2 — estado por defecto DENEGADO.
 *
 * Este script debe ejecutarse antes de que se cargue Google Analytics
 * (el componente <GoogleAnalytics> del root layout). Define gtag/dataLayer,
 * fija todas las señales de consentimiento en 'denied' y, si el visitante ya
 * consintió en una visita anterior (cookie de primera parte `cookie_consent`),
 * aplica el 'update' de inmediato para no perder el consentimiento entre
 * visitas antes de que hidrate React.
 *
 * Modo "advanced": GA queda montado siempre y envía pings sin cookies
 * mientras el consentimiento esté denegado. Si alguna autoridad europea
 * exigiera el modo estricto, la alternativa es condicionar el montaje de
 * <GoogleAnalytics> a la cookie (render server-side con cookies()).
 *
 * Nota: solo otorgamos `analytics_storage`. Las señales de ads
 * (ad_storage/ad_user_data/ad_personalization) quedan siempre en 'denied'
 * porque el sitio no sirve publicidad. Si algún día se activa AdSense para
 * tráfico del EEE, Google exige un CMP certificado TCF — este banner propio
 * solo cubre analítica.
 */
export const CONSENT_COOKIE = 'cookie_consent'

export const CONSENT_INIT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
try {
  var m = document.cookie.match(/(?:^|; )${CONSENT_COOKIE}=(granted|denied)/);
  if (m && m[1] === 'granted') {
    gtag('consent', 'update', { analytics_storage: 'granted' });
  }
} catch (e) {}
`.trim()
