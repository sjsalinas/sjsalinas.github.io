# sjsalinas.github.io - research portfolio

Static portfolio site (plain HTML/CSS/JS, no build step) for Sebastian Salinas,
PhD applicant in neurobiology. Red neuro theme, Sasaki-style editorial type.

Animation via CDN (graceful offline fallback to static content):
GSAP 3.12 + ScrollTrigger (reveals, parallax) and Lenis 1.3 (smooth scroll).

## Preview locally

Open `index.html` in a browser, or serve the folder:

```
python -m http.server 8000
```

then visit http://localhost:8000

## Publish (GitHub Pages)

1. On github.com/sjsalinas, create a new public repo named exactly `sjsalinas.github.io`
2. Upload all files in this folder (index.html, styles.css, script.js, assets/)
   keeping the same structure
3. Repo Settings → Pages → Deploy from branch → `main` / root
4. Site goes live at https://sjsalinas.github.io (takes ~1 minute)

## Adding your files

- Portrait: `assets/photo.jpg`
- Research images: `assets/j20.jpg`, `assets/leishmania.jpg`, `assets/nasa.jpg`
  (the site auto-detects them once added; placeholders show until then)
- CV download: `assets/Sebastian-Salinas-CV.pdf`
  (both Download CV buttons point here)
