# PostHog post-wizard report

PostHog is now initialized for the browser with automatic SPA pageviews, autocapture, session recording defaults, and exception autocapture. The browser SDK is loaded from the root layout and reads its token and host exclusively from `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` in `.env.local`.

The server SDK is also initialized for authoritative registration and admin-session events. Instrumentation covers directory discovery, successful admin authentication and sign-out, administrative record creation and moderation, featured-content updates, beta-registration persistence, and caught errors in critical client-side flows. Event properties deliberately exclude emails, names, search text, geographic coordinates, and other user-provided content.

| Event name | Description | File |
| --- | --- | --- |
| `directory_tab_selected` | Tracks when a visitor switches the directory content type. | `components/public/DirectorySplit.tsx` |
| `directory_search_submitted` | Tracks when a visitor searches the public capoeira directory. | `components/public/DirectorySplit.tsx` |
| `nearby_directory_requested` | Tracks when a visitor requests nearby directory results. | `components/public/DirectorySplit.tsx` |
| `admin_login_succeeded` | Tracks successful administrator authentication in the web portal. | `app/[locale]/admin/login/page.tsx` |
| `admin_logout_completed` | Tracks administrator sign-out from the web portal. | `components/admin/AdminTopbar.tsx` |
| `admin_job_created` | Tracks successful creation of an administrative notification, export, or finance record. | `components/admin/AdminCreateJobForm.tsx` |
| `admin_featured_content_updated` | Tracks successful changes to featured public content. | `components/admin/AdminFeaturedToggle.tsx` |
| `admin_moderation_updated` | Tracks successful moderation decisions made by administrators. | `components/admin/AdminModerationActionButtons.tsx` |
| `beta_registration_submitted` | Tracks successful beta registration persistence on the server. | `app/api/beta-registration/route.ts` |
| `admin_session_created` | Tracks successful administrator session creation on the server. | `app/api/admin/auth/login/route.ts` |

## Next steps

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/509429/dashboard/1860235)
- Insights were not created because these new custom events have not yet been received in the active project schema. Trigger the instrumented flows after deployment, then create trends and funnels from confirmed event data.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-administrator path also calls `identify` — the current handler identifies on fresh login only.

### Agent skill

An agent skill folder remains in the project at `.claude/skills/integration-javascript_web` for future PostHog development.
