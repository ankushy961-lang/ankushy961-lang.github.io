# ankushy961-lang.github.io

Portfolio of Ankush Yadav. Five shipped apps, each running as a live demo inside the page.

Live: https://ankushy961-lang.github.io/

## What is here

- `index.html`, `styles.css`, `app.js`: the site. Static, no build step. Three.js r128 is loaded from cdnjs for the background field.
- `blog/`: writing, plain static HTML sharing the site's tokens.
- `favicon.svg`, `apple-touch-icon.png`, `og.png`: icons and the social card.
- `robots.txt`, `sitemap.xml`, `llms.txt`: search and answer-engine files.

## Run locally

Any static server works:

```
python -m http.server 8765
```

Then open http://localhost:8765/

## Notes

- Dark theme first, light theme designed to the same standard. The toggle in the dock remembers your choice.
- Reduced-motion users get a still page with every demo still usable.
- The background field steps its own quality down if frames drop.

© 2026 Ankush Yadav
