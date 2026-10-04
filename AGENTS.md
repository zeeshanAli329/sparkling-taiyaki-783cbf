# AGENTS.md

## Architecture
This is a static single-page site with no framework and no build step. `netlify.toml` publishes `public/`.

- `public/index.html` holds all sections and both Netlify Forms (`newsletter` and `order`). The forms are written directly in static HTML so that Netlify's build bot detects them. If you add fields, add them to the HTML form too, not only in JS.
- `public/styles.css` contains all styles. Design tokens are CSS variables in `:root`: gold `#f9c06a`, brown `#603809`, cream `#fff9f1`. Classes use BEM-ish names (`block__elem`, `--modifier`).
- `public/main.js` has the `PRODUCTS` array, which is the single source of truth for menu items. The menu grid and order bag render from it. The file also runs the order bag (saved in localStorage under `beanscene-bag`), the AJAX form posts to `/`, the reviews slider and the scroll-reveal effects.
- `public/img/` holds AI-generated PNG images. Always reference them through the Image CDN (`/.netlify/images?url=/img/<file>&w=<width>&fm=webp`), never directly.

## Conventions
- Keep it dependency-free. Vanilla JS and plain CSS only.
- Forms submit with `application/x-www-form-urlencoded` to `/`, include a hidden `form-name` field, and use the `bot-field` honeypot.
- Netlify Forms was enabled with the netlify-forms skill's `enable.cjs` script.
