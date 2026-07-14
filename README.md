# Palissa Washington — Website

Static site (plain HTML/CSS/JS) built from `Palissa_Washington_Website_Copy.md`. No framework, no build step — open `index.html` directly or deploy as static files.

## What's inside

- `index.html` — all 8 sections (hero, who this is for, problems, services, why me, tools, offer, contact)
- `css/style.css` — charcoal + teal/amber theme, responsive layout
- `js/main.js` — smooth scroll (Lenis), scroll-triggered reveals + animated stat counters (GSAP/ScrollTrigger), subtle animated network background in the hero, contact form handling
- Libraries load from CDN (jsdelivr): GSAP, ScrollTrigger, Lenis. If they fail to load, the site still works — content just appears without animation (see fallback in `main.js`).

## 1. Preview it locally

Just open `index.html` in a browser — no server required. For the smoothest local testing (some browsers restrict fetch/canvas behavior on `file://`), you can also run a quick local server:

```bash
cd palissa-site
python3 -m http.server 8000
# then visit http://localhost:8000
```

## 2. Connect the contact form (Web3Forms — free, no backend needed)

The form in the Contact section posts to Web3Forms, which forwards submissions straight to your inbox. Until you add a key, submitting shows a message pointing people to email you directly — nothing breaks.

1. Go to https://web3forms.com and enter **palissawashington@gmail.com** to get a free Access Key (no account required, arrives by email).
2. Open `index.html`, find this line near the contact form:
   ```html
   <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">
   ```
3. Replace `YOUR_ACCESS_KEY_HERE` with your real key.
4. Done — submissions will arrive by email. No server, database, or monthly cost (free tier covers up to 250 submissions/month).

## 3. Deploy (recommended: Cloudflare Pages + GitHub)

You already use both, so this keeps your stack consistent and auto-deploys on every push.

1. Create a new GitHub repo (e.g. `palissa-website`) and push this folder's contents to it.
2. In Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**, select the repo.
3. Build settings: **no build command**, **output directory: `/`** (root) — this is a static site, nothing to compile.
4. Deploy. Cloudflare gives you a free `*.pages.dev` URL immediately.
5. When you're ready for a real domain: buy one (Namecheap/Cloudflare Registrar) and connect it under **Custom domains** in the Pages project — Cloudflare handles DNS/SSL automatically.

Alternative (even simpler, no GitHub): drag-and-drop the `palissa-site` folder into Cloudflare Pages' direct upload option. You lose auto-deploy-on-push, but it's live in under a minute.

## 4. Content edits

All copy lives directly in `index.html`, matching `Palissa_Washington_Website_Copy.md` section-for-section. To update copy, edit the text between the tags — no rebuild needed, just re-save and redeploy (or re-upload).

To adjust the color theme, edit the CSS variables at the top of `css/style.css`:

```css
--bg: #0b0f14;        /* page background */
--accent: #2dd4bf;     /* teal accent */
--accent-amber: #f0b429; /* amber accent (dots, bullets) */
```

## 5. Still open

- **Headshot/photo:** none on file yet. The "Why Work With Me" section currently runs text-only by design — add an `<img>` there later if you get a professional photo.
- **Booking link:** all CTA buttons currently scroll to the contact form. Swap to a Calendly (or similar) link once you set one up — search `href="#contact"` in `index.html` and replace with your booking URL.
- **Analytics:** none installed. Cloudflare Pages includes free Web Analytics (privacy-friendly, no cookie banner needed) — enable it from the Pages project dashboard once deployed.
