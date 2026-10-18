# Palissa Washington — Personal Brand Website

Single-page site for Palissa Washington, AI Workflow Architect for service businesses. Plain HTML, CSS, and JavaScript — no framework, no build step.

**Stack:** HTML/CSS/JS · GSAP + ScrollTrigger for scroll animation · Lenis for smooth scroll · Web3Forms for the contact form (no backend)

## Run locally

```bash
git clone https://github.com/codewithpalissa/palissa.git
cd palissa
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. (Opening `index.html` directly also works, but some browsers restrict canvas/fetch behavior on `file://`.)

## Deploy

Hosted on Cloudflare Pages, auto-deployed from `main`. No build command; output directory is the repo root.

## Structure

```
index.html      site content
css/style.css   theme + layout
js/main.js      animations, smooth scroll, contact form
```
