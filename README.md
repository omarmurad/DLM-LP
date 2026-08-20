# DLM — Digital Line Media — Landing Page

A bilingual (Arabic/English) single-page site: hero, We're Ready, Our
Purpose, Our Message, Services, Why DLM, Success Stories, work samples,
process, a working contact form, FAQ, and footer. Plain HTML/CSS/JS —
no build step, no framework.

## Analytics & tracking — already wired in, just add your IDs

Open `index.html` and look at the top of `<head>` — there's a clearly
marked block with:

- **Google Tag Manager** — active by default. Replace `GTM-XXXXXXX`
  (appears twice: once in `<head>`, once in the `<noscript>` right after
  `<body>`) with your real container ID from tagmanager.google.com.
- **Microsoft Clarity** — active by default. Replace `YOUR_CLARITY_ID`
  with your real project ID from clarity.microsoft.com.
- **GA4 / Google Ads / Meta Pixel / TikTok Pixel / Snapchat Pixel** —
  commented-out direct-install snippets, given as an alternative to
  configuring them through GTM. The recommended path is to leave these
  commented out and instead add each as a *tag inside your GTM dashboard*
  (GTM → Tags → New) once GTM itself is live — that way none of this file
  needs editing again for those five. Only uncomment one of these direct
  snippets if you deliberately want that one tool to bypass GTM — don't
  run both a GTM-managed tag and a direct snippet for the same platform
  at once, it double-counts.

## Before you publish — 3 placeholders to replace

### 1. WhatsApp number
Search the project for `966500000000` (appears in `index.html` in
several places: the hero, the final CTA, the contact-page side panel,
and the floating WhatsApp bubble) and replace it with your real WhatsApp
Business number in international format, no `+` or spaces, e.g. for a
Saudi number: `9665XXXXXXXX`.

### 2. Contact form → Formspree
The form currently posts to a placeholder endpoint and will show a
friendly "not connected yet" message instead of failing silently. To
make it actually deliver messages to an inbox:

1. Go to [formspree.io](https://formspree.io) and create a free account.
2. Create a new form, and copy the endpoint it gives you
   (looks like `https://formspree.io/f/abcd1234`).
3. Open `index.html`, find this line in the Contact section:
   ```html
   <form class="contact-form" id="contactForm" action="https://formspree.io/f/REPLACE_WITH_YOUR_FORMSPREE_ID" method="POST">
   ```
   and replace `REPLACE_WITH_YOUR_FORMSPREE_ID` with your real form ID.
4. Formspree will ask you to verify your email once — do that, then test
   the form live on your published site to confirm delivery.

### 3. Social links
In the footer, `Instagram` and `LinkedIn` currently link to `#` (nowhere).
Search for `href="#" target="_blank"` in `index.html` and swap in your
real profile URLs.

## Preview locally

```bash
cd dlm-site
python3 -m http.server 8000
```
Then visit http://localhost:8000

## Files

```
index.html          the whole site, including the analytics block
css/styles.css       styling, brand colors, layout
js/i18n.js           English + Arabic copy — edit any text here
js/main.js           language toggle, FAQ accordion, work filter, form logic, mobile popup
assets/fonts/        Wafeq font
assets/img/          logo, photos, client logos
```

To edit copy: open `js/i18n.js` — every string has an `ar` and `en` entry
under the same key.

## About the "Work" section

The 6 work tiles are illustrative placeholders (abstract shapes + generic
category labels like "Full visual identity system") — not real client
case studies. Real case studies now live in the separate "Success
Stories" section instead. Swap in real project names/thumbnails for the
Work tiles once you have them — to use real photos instead of the
abstract color/shape tiles, replace the `<svg class="deco">` inside each
`.work-tile` with an `<img>`.

## Connect it to your Namecheap domain

Same process as before — GitHub Pages + Namecheap DNS:

1. Push this folder to a new GitHub repository.
2. Repo → **Settings → Pages** → Source: `Deploy from a branch`, branch
   `main`, folder `/ (root)`.
3. In the same Pages settings, add your custom domain — this creates a
   `CNAME` file automatically.
4. In Namecheap → **Advanced DNS**, remove any existing parking `A` record
   or `URL Redirect Record` on host `@`, then add:
   - 4× `A` record, host `@`, values: `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`
   - `CNAME` record, host `www`, value `yourusername.github.io.`
5. Wait for DNS to propagate, confirm "DNS check successful" in GitHub
   Pages settings, then enable **Enforce HTTPS**.
