// Captures a landing-page opt-in and upserts the contact into GoHighLevel.
//
// Secrets (set in Supabase project settings, never in the client bundle):
//   GHL_API_KEY      - GoHighLevel API key / Private Integration token
//   GHL_LOCATION_ID  - GoHighLevel Location (sub-account) ID
//   GHL_API_VERSION  - optional, defaults to LeadConnector v2 "2021-07-28"
//
// The API key stays server-side; the browser only talks to this function.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LeadPayload {
  email?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  source?: string;
  tags?: string[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let payload: LeadPayload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const email = (payload.email || "").trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return json({ error: "A valid email is required." }, 400);
  }

  const firstName = (payload.firstName || "").trim();
  const lastName = (payload.lastName || "").trim();
  const name = (payload.name || `${firstName} ${lastName}`).trim();
  const phone = (payload.phone || "").trim();
  const source = (payload.source || "Landing Page - Guia Delegar").trim();
  const tags = Array.isArray(payload.tags) && payload.tags.length
    ? payload.tags
    : ["Lead Magnet - Guia Delegar"];

  const apiKey = Deno.env.get("GHL_API_KEY") || "";
  const locationId = Deno.env.get("GHL_LOCATION_ID") || "";
  const version = Deno.env.get("GHL_API_VERSION") || "2021-07-28";

  // If secrets aren't configured yet, don't hard-fail the visitor experience:
  // report "not configured" so the page can still deliver the guide, while the
  // owner is told (in logs) to add the secrets.
  if (!apiKey || !locationId) {
    console.warn(
      "GHL not configured: set GHL_API_KEY and GHL_LOCATION_ID secrets.",
    );
    return json({ ok: true, captured: false, configured: false });
  }

  const contact: Record<string, unknown> = {
    locationId,
    email,
    source,
    tags,
  };
  if (firstName) contact.firstName = firstName;
  if (lastName) contact.lastName = lastName;
  if (name) contact.name = name;
  if (phone) contact.phone = phone;

  try {
    // LeadConnector v2 upsert avoids duplicate-contact errors on repeat opt-ins.
    const res = await fetch(
      "https://services.leadconnectorhq.com/contacts/upsert",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Version: version,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(contact),
      },
    );

    const text = await res.text();
    if (!res.ok) {
      console.error("GHL upsert failed", res.status, text);
      return json(
        { ok: false, captured: false, configured: true, status: res.status },
        502,
      );
    }

    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    return json({ ok: true, captured: true, configured: true, data });
  } catch (error) {
    console.error("Error contacting GHL:", error);
    return json({ ok: false, captured: false, error: String(error) }, 500);
  }
});
