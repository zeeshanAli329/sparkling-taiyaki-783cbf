# Bean Scene

A landing page for **Bean Scene**, a coffee shop. It has a hero section, a "Discover" story, a menu of four signature drinks, a "Why are we different?" section, a promo banner, a customer reviews carousel, a newsletter signup and a full footer.

Visitors can add drinks to an order bag, adjust quantities and place a pickup order. Pickup orders and newsletter signups are collected with Netlify Forms.

## Tech

- Static HTML, CSS and vanilla JavaScript, with no build step
- Netlify Forms for the `order` and `newsletter` forms
- Netlify Image CDN, which serves resized WebP versions of the images
- Custom photography generated with Gemini image models through Netlify AI Gateway
- Google Fonts: Clicker Script, Playfair Display and Inter

## Run locally

```bash
netlify dev --port 8889
```

Then open http://localhost:8889. Image CDN URLs and form submissions only work under `netlify dev` or on a deploy, not when you open `index.html` directly.

## Viewing submissions

In the Netlify dashboard, open **Forms**. Pickup orders arrive under `order`, with the items, total, name, phone and pickup time. Signups arrive under `newsletter`.
