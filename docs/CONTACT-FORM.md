# Contact form

The form on `/contact` posts to a Netlify Function, which filters spam and
delivers the message through Resend to `sarah@incr-ediblecupcakes.com`.

Before this existed the form was a prop: the submit handler called
`console.log`, showed an alert saying the message had been sent, and reset the
fields. Nothing ever left the browser, so every message sent through it since
the site launched was lost.

| Piece | Where |
| --- | --- |
| Form markup and submit handler | `src/pages/contact.astro` |
| Server handler | `netlify/functions/contact.mjs` |
| Endpoint | `POST /api/contact` |
| CSP allowances | `netlify.toml` |

The site stays `output: 'static'`. A Netlify Function runs alongside a static
build, so no Astro adapter and no SSR were needed.

## Environment variables

Set these in **Netlify → Site configuration → Environment variables**, not in a
committed file. They are read at request time by the function, so changing one
takes effect on the next deploy without a code change.

| Variable | Required | Default | Notes |
| --- | --- | --- | --- |
| `RESEND_API_KEY` | yes | — | Without it the function returns a 502 telling the visitor to email directly. |
| `CONTACT_TO_EMAIL` | no | `sarah@incr-ediblecupcakes.com` | Where messages land. |
| `CONTACT_FROM_EMAIL` | no | `Incr-EdibleCupCakes <noreply@incr-ediblecupcakes.com>` | Must be on a domain verified in Resend. |
| `PUBLIC_TURNSTILE_SITE_KEY` | no | — | Public. Baked into the page at build time, so it needs a redeploy to take effect. |
| `TURNSTILE_SECRET_KEY` | no | — | Secret. Read at request time. |

The visitor's address goes in `Reply-To`, never in `From`. Sending as the
visitor would fail SPF and DKIM on the domain and land the mail in spam.

## How spam is handled

Five layers, because none of them holds alone.

1. **Form token.** A hidden field that only JavaScript fills in, stamped with
   the time the page loaded. Most form spam is a blind POST at the endpoint by
   something that never rendered the page, so a missing token is the strongest
   single signal available.
2. **Honeypot.** A `website` field positioned off-screen and marked
   `aria-hidden` with `tabindex="-1"`, so no person and no screen reader
   reaches it. Anything that fills it is automated.
3. **Minimum fill time.** Under three seconds between page load and submit is
   not a human writing a message.
4. **Rate limit.** Three messages per IP per hour, tracked in Netlify Blobs
   under a hash of the address rather than the address itself.
5. **Content heuristics.** More than two links, known cold-outreach phrasing
   (SEO packages, guest posts, crypto, casinos), and throwaway email domains.

Layers 1 to 3 and the spam-phrase check return **a fake success**. A bot that
gets an error retries with variations; one that gets a 200 moves on. Checks
that can misfire on a real person — link count, disposable domain, validation —
return a real error saying what to change.

### Turnstile

Cloudflare Turnstile is wired up but off by default. The layers above handle
ordinary form spam, and gating the form behind a Cloudflare account would have
left it broken until that account existed. To switch it on:

1. Create a Turnstile widget at <https://dash.cloudflare.com/?to=/:account/turnstile>
   for `incr-ediblecupcakes.com`.
2. Add `PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in Netlify.
3. Redeploy, because the site key is baked into the static page.

`challenges.cloudflare.com` is already allowed in the CSP, so no other change
is needed.

## Failure behaviour

| Situation | Result |
| --- | --- |
| Resend rejects or is down | 502, and the visitor is told to email the address directly. |
| Netlify Blobs unavailable | Rate limiting is skipped and the request continues. A form that refuses everyone because its bookkeeping broke is worse than one that accepts a duplicate, and the other four layers still apply. |
| JavaScript disabled | The form does not submit. A `<noscript>` block gives the email address instead. |

## Injection safety

Every field is stripped of control characters before use, which is what stops
header injection: a newline in a value that reaches a `Reply-To` field lets the
sender append headers of their own. The email address is additionally matched
against a deliberately strict pattern. All values are HTML-escaped before they
go into the message body.
