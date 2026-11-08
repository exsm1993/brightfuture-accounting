# Integrate365.ai: marketing site

A single-page marketing site for **Integrate365.ai: Your AI team, inside Initiate365**, built from the product demo video.

It is fully static: one `index.html` (HTML, CSS and JS inline) plus an `assets/` folder. There's no build step and no dependencies. It is separate from the accounting app in the rest of this repo.

## What's on the page

| Section | What it shows |
| --- | --- |
| Hero | "Watch it. Teach it once.", with Book a demo and a button that plays the 1-minute demo video |
| Product preview | The *Your AI team → Results* screen, rebuilt in HTML with sample data. The This week / This month toggle works. |
| What it does | Follow-up, confirmations, paperwork |
| How it works | An interactive, auto-playing demo of the three steps: **Watch it work**, **Show it once** (recording) and **Approve the skill**. Visitors can click through it themselves. |
| What it can do | A skills library with search, filters, on/off toggles and *Learned from you* drafts you can review and approve |
| Inside Initiate365 | Where the agent works (Leads, Appointments, Projects, and more), plus a *Talk to it* chat example |
| Guardrails | "Skills carry the method only", approvals, passwords, audit log |
| FAQ and Book a demo | Accordion FAQ (also in JSON-LD) and a demo-request form |

## Preview locally

```sh
cd integrate365-site
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

Upload the folder as-is to any static host (Netlify, Vercel, Cloudflare Pages, S3, GitHub Pages). Point `integrate365.ai` at it.

## Before launch: please confirm

1. **Demo form.** In `index.html`, find `<form id="demoForm" data-endpoint="" data-email="hello@integrate365.ai">`.
   - Set `data-endpoint` to your form handler (Formspree, HubSpot, a CRM webhook, …). The form POSTs `FormData` with the fields `name`, `company`, `email`, `phone`, `trade` and `message`.
   - Until the endpoint is set, submitting opens the visitor's email app addressed to `data-email`. **`hello@integrate365.ai` is a placeholder.** Replace it with a real inbox.
2. **Numbers.** All metrics (41 leads, 6 min to first call, 31% fewer no-shows, ~31 hours saved, 4.1×, the skill counts) come from the demo's sample workspace and are labeled as sample data on the page. The "This month" figures are illustrative too. Swap in real customer numbers when you have them.
3. **Legal pages.** There's no privacy policy or terms page yet. You'll want at least a privacy policy linked near the form.
4. **Domain.** The canonical URL, Open Graph image and JSON-LD all assume `https://integrate365.ai/`.

## Assets

- `assets/demo.mp4`: the demo video, converted to H.264/AAC so it plays in every browser (about 2.2 MB)
- `assets/demo-poster.jpg`: the video's poster frame
- `assets/og-image.png`: the share image (the "Watch it. Teach it once." end card)
- `assets/favicon.svg`: the 365 mark
