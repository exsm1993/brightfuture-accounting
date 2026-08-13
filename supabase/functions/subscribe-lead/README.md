# `subscribe-lead` — GoHighLevel lead capture

This edge function receives opt-ins from the `/free-guide` landing page and
upserts the contact into GoHighLevel (GHL). The GHL API key stays server-side —
it is **never** shipped in the browser bundle.

## 1. Set the secrets

In your Supabase project (Dashboard → Project Settings → Edge Functions → Secrets,
or the CLI), set:

| Secret            | Where to find it in GoHighLevel                                    |
| ----------------- | ------------------------------------------------------------------ |
| `GHL_API_KEY`     | Settings → Private Integrations (create a token with the Contacts **Write** scope). A legacy Location API key also works. |
| `GHL_LOCATION_ID` | Settings → Business Info (the sub-account / location ID).           |
| `GHL_API_VERSION` | *(optional)* defaults to `2021-07-28`.                             |

```bash
supabase secrets set GHL_API_KEY=xxxxx GHL_LOCATION_ID=xxxxx
```

## 2. Deploy the function

```bash
supabase functions deploy subscribe-lead
```

`verify_jwt` is disabled for this function (see `supabase/config.toml`) so the
public landing page can call it without a logged-in user.

## Behaviour

- Validates the email, then calls the LeadConnector v2 `contacts/upsert`
  endpoint (upsert avoids duplicate-contact errors on repeat opt-ins).
- Tags each contact `Lead Magnet - Delegation Guide` and sets the source, so you
  can trigger a GHL welcome/follow-up workflow off the tag.
- If the secrets are **not** set yet, the function returns
  `{ ok: true, captured: false, configured: false }` and logs a warning — the
  landing page still delivers the guide, so nothing breaks before you finish
  wiring up GHL.
