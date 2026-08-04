/**
 * Contact form handler.
 *
 * The form on /contact used to be a prop: it called console.log and showed an
 * alert saying the message had been sent. Nothing ever left the browser. This
 * receives the submission, filters spam, and delivers it through Resend.
 *
 * Anti-spam is layered, because no single check survives contact with a real
 * spammer. In rough order of how much traffic each one stops:
 *
 *   1. A form token that only JavaScript writes. Most form spam is a blind POST
 *      straight at the endpoint by something that never rendered the page, so a
 *      missing token is the single strongest signal available.
 *   2. A honeypot field, hidden from people and irresistible to bots.
 *   3. A minimum fill time. Nobody writes a real message in three seconds.
 *   4. Per-IP rate limiting, so one bot that clears the above cannot flood.
 *   5. Content heuristics: link count, known spam phrasing, throwaway domains.
 *
 * Checks 1 to 3 fire only for bots, so they return a fake success. A bot that
 * gets an error tries again with variations; one that gets a 200 moves on.
 * Check 5 can misfire on a real person, so it returns a real error telling them
 * what to change.
 */

const MAX_BODY_BYTES = 16_000;
const MIN_FILL_SECONDS = 3;
const MAX_TOKEN_AGE_SECONDS = 24 * 60 * 60;
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60;

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'sarah@incr-ediblecupcakes.com';
const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL || 'Incr-EdibleCupCakes <noreply@incr-ediblecupcakes.com>';

const ALLOWED_ORIGINS = new Set([
  'https://incr-ediblecupcakes.com',
  'https://www.incr-ediblecupcakes.com',
  'http://localhost:8888',
  'http://localhost:4321',
]);

const SUBJECTS = {
  'recipe-question': 'Recipe Question',
  collaboration: 'Collaboration Inquiry',
  workshop: 'Workshop Information',
  feedback: 'Feedback & Suggestions',
  media: 'Media & Press',
  other: 'Other',
};

// Deliberately strict. A contact form has no reason to accept the exotic
// corners of RFC 5322, and every character excluded here is one that cannot be
// smuggled into an email header.
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,24}$/;

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', '10minutemail.com',
  'tempmail.com', 'temp-mail.org', 'throwawaymail.com', 'yopmail.com',
  'sharklasers.com', 'trashmail.com', 'getnada.com', 'dispostable.com',
  'maildrop.cc', 'fakeinbox.com', 'mintemail.com', 'spam4.me', 'mohmal.com',
  'emailondeck.com', 'moakt.com', 'tempr.email', 'discard.email',
]);

// Phrases that essentially never appear in a note about cupcakes, but carry
// most of the cold-outreach spam that reaches small food blogs.
const SPAM_PATTERNS = [
  /\bseo (services|expert|agency|audit|package)\b/i,
  /\b(guest post|link building|backlinks?|do-?follow)\b/i,
  /\brank (higher|#?1) (on|in) google\b/i,
  /\b(crypto|bitcoin|forex|binary options?|trading bot)\b/i,
  /\b(casino|poker|betting|gambling|slots online)\b/i,
  /\b(viagra|cialis|pharmacy online)\b/i,
  /\bincrease your (traffic|sales|revenue) by\b/i,
  /\bwe (can|will) (help|assist) you (rank|grow|scale)\b/i,
  /\b(loan|mortgage) (offer|approval)\b/i,
  /\bwork from home\b.{0,40}\$\d/i,
  /\b(bulk|mass) (email|sms|whatsapp)\b/i,
  /\bpurchase (this |our )?(domain|website)\b/i,
];

const URL_RE = /\b(?:https?:\/\/|www\.)[^\s<>"']+|\b[a-z0-9-]+\.(?:com|net|org|io|ru|cn|xyz|top|info|biz|shop|club|online|site)\b/gi;

const json = (status, body, origin) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...(origin ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {}),
    },
  });

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

/**
 * Header injection is the one contact-form bug that turns a website into an
 * open relay: a newline in a value the recipient copies into a To or Reply-To
 * field lets the sender append headers of their own. Nothing with a control
 * character reaches Resend.
 */
const stripControlChars = (value) =>
  String(value ?? '')
    .replace(/[\x00-\x1F\x7F]/g, ' ')
    .trim();

const countLinks = (text) => (text.match(URL_RE) ?? []).length;

async function hashIp(ip) {
  // The rate-limit store keeps a fingerprint, not an address. It only ever has
  // to answer "same visitor as a minute ago", which a hash does just as well.
  const bytes = new TextEncoder().encode(`incr-cupcakes:${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}

/**
 * Returns true when this visitor has already sent RATE_LIMIT_MAX messages
 * inside the window.
 *
 * If the blob store is unavailable the limiter fails open. A contact form that
 * refuses everyone because its bookkeeping broke is worse than one that briefly
 * accepts a duplicate, and every other layer is still in force.
 */
async function isRateLimited(ip) {
  try {
    const { getStore } = await import('@netlify/blobs');
    const store = getStore({ name: 'contact-rate-limit', consistency: 'strong' });
    const key = await hashIp(ip);
    const now = Math.floor(Date.now() / 1000);

    const previous = (await store.get(key, { type: 'json' })) ?? { hits: [] };
    const hits = (previous.hits ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_SECONDS);

    if (hits.length >= RATE_LIMIT_MAX) return true;

    hits.push(now);
    await store.setJSON(key, { hits });
    return false;
  } catch (error) {
    console.warn('[contact] rate limiter unavailable, allowing request:', error.message);
    return false;
  }
}

/**
 * Cloudflare Turnstile, when configured. Optional on purpose: the layers above
 * handle ordinary form spam on their own, and requiring a Cloudflare account
 * before the form works at all would leave it broken in the meantime. Set
 * TURNSTILE_SECRET_KEY and PUBLIC_TURNSTILE_SITE_KEY to switch it on.
 */
async function turnstilePasses(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = await res.json();
    return data.success === true;
  } catch (error) {
    console.error('[contact] Turnstile verification failed:', error.message);
    return false;
  }
}

async function sendEmail({ name, email, subjectKey, message, ip, userAgent }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured');

  const subjectLabel = SUBJECTS[subjectKey];
  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    subject: escapeHtml(subjectLabel),
    message: escapeHtml(message).replaceAll('\n', '<br>'),
  };

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      reply_to: email,
      subject: `[Contact] ${subjectLabel} - ${name}`,
      text: [
        `From:    ${name} <${email}>`,
        `Topic:   ${subjectLabel}`,
        '',
        message,
        '',
        '---',
        `Sent from the contact form on incr-ediblecupcakes.com`,
        `User agent: ${userAgent}`,
      ].join('\n'),
      html: `
        <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:600px">
          <h2 style="margin:0 0 4px">${safe.subject}</h2>
          <p style="margin:0 0 20px;color:#666">
            from <strong>${safe.name}</strong>
            &lt;<a href="mailto:${safe.email}">${safe.email}</a>&gt;
          </p>
          <div style="padding:16px;background:#faf7f5;border-left:3px solid #f4808c;border-radius:4px;white-space:pre-wrap">${safe.message}</div>
          <p style="margin-top:24px;font-size:12px;color:#999">
            Sent from the contact form on incr-ediblecupcakes.com. Reply to this email to answer directly.
          </p>
        </div>`,
    }),
  });

  if (!res.ok) {
    // The response body can echo request details, so only the status and
    // Resend's own message are logged. The key is never in either.
    const detail = await res.text().catch(() => '');
    throw new Error(`Resend returned ${res.status}: ${detail.slice(0, 300)}`);
  }

  return res.json();
}

export default async (req, context) => {
  const origin = req.headers.get('origin') ?? '';
  const allowedOrigin = ALLOWED_ORIGINS.has(origin) ? origin : null;

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: allowedOrigin
        ? {
            'Access-Control-Allow-Origin': allowedOrigin,
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            Vary: 'Origin',
          }
        : {},
    });
  }

  if (req.method !== 'POST') {
    return json(405, { ok: false, error: 'Method not allowed.' }, allowedOrigin);
  }

  // An Origin header from somewhere else means this is not our form. Requests
  // with no Origin at all are let through to the checks below rather than
  // rejected here, since some privacy tooling strips it from same-origin posts.
  if (origin && !allowedOrigin) {
    return json(403, { ok: false, error: 'Forbidden.' }, null);
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json(413, { ok: false, error: 'That message is too long.' }, allowedOrigin);
  }

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, error: 'Malformed request.' }, allowedOrigin);
  }

  const ip =
    req.headers.get('x-nf-client-connection-ip') ||
    (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() ||
    context?.ip ||
    'unknown';
  const userAgent = stripControlChars(req.headers.get('user-agent') ?? 'unknown').slice(0, 200);

  // --- silent drops: only a bot reaches these -----------------------------
  const pretendItWorked = () => json(200, { ok: true }, allowedOrigin);

  if (stripControlChars(body.website)) {
    console.log('[contact] dropped: honeypot filled');
    return pretendItWorked();
  }

  const token = Number.parseInt(String(body.formToken ?? ''), 36);
  if (!Number.isFinite(token) || token <= 0) {
    console.log('[contact] dropped: no form token (posted without rendering the page)');
    return pretendItWorked();
  }

  const elapsed = (Date.now() - token) / 1000;
  if (elapsed < MIN_FILL_SECONDS) {
    console.log(`[contact] dropped: submitted after ${elapsed.toFixed(1)}s`);
    return pretendItWorked();
  }
  if (elapsed > MAX_TOKEN_AGE_SECONDS) {
    return json(
      400,
      { ok: false, error: 'This page has been open a while. Please refresh and try again.' },
      allowedOrigin,
    );
  }

  if (!(await turnstilePasses(body.turnstileToken, ip))) {
    return json(
      400,
      { ok: false, error: 'Could not verify that you are human. Please refresh and try again.' },
      allowedOrigin,
    );
  }

  // --- validation: a real person can read and act on these ----------------
  const name = stripControlChars(body.name);
  const email = stripControlChars(body.email).toLowerCase();
  const subjectKey = stripControlChars(body.subject);
  const message = String(body.message ?? '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();

  const errors = [];
  if (name.length < 2 || name.length > 80) errors.push('Please enter your name.');
  if (email.length > 254 || !EMAIL_RE.test(email)) errors.push('Please enter a valid email address.');
  if (!SUBJECTS[subjectKey]) errors.push('Please choose a topic.');
  if (message.length < 20) errors.push('Please write a little more so I can actually help.');
  if (message.length > 4000) errors.push('Please keep the message under 4000 characters.');
  if (errors.length) return json(400, { ok: false, error: errors[0] }, allowedOrigin);

  if (DISPOSABLE_DOMAINS.has(email.split('@')[1])) {
    return json(
      400,
      { ok: false, error: 'Please use a real email address so I can reply to you.' },
      allowedOrigin,
    );
  }

  // --- content heuristics -------------------------------------------------
  const haystack = `${name} ${message}`;
  if (countLinks(haystack) > 2 || URL_RE.test(name)) {
    URL_RE.lastIndex = 0;
    return json(
      400,
      { ok: false, error: 'Please remove the links from your message and send it again.' },
      allowedOrigin,
    );
  }
  URL_RE.lastIndex = 0;

  const matched = SPAM_PATTERNS.find((re) => re.test(haystack));
  if (matched) {
    console.log(`[contact] dropped: matched spam pattern ${matched}`);
    return pretendItWorked();
  }

  if (await isRateLimited(ip)) {
    return json(
      429,
      { ok: false, error: 'You have already sent a few messages. Please try again later.' },
      allowedOrigin,
    );
  }

  // --- deliver ------------------------------------------------------------
  try {
    await sendEmail({ name, email, subjectKey, message, ip, userAgent });
    console.log(`[contact] delivered: ${subjectKey} from ${email.split('@')[1]}`);
    return json(200, { ok: true }, allowedOrigin);
  } catch (error) {
    console.error('[contact] delivery failed:', error.message);
    return json(
      502,
      {
        ok: false,
        error: `Sorry, the message could not be sent right now. Please email ${TO_EMAIL} directly.`,
      },
      allowedOrigin,
    );
  }
};

export const config = { path: '/api/contact' };
