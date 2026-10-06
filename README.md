# Studio Supply

A colourful, responsive shopping-cart exercise built with plain HTML, CSS and JavaScript. The original Git tutorial placeholders have become a fictional stationery shop, with locally stored SVG artwork.

## Run locally

Open `index.html` in a browser, or serve this directory:

```sh
python3 -m http.server 8000
```

Then visit http://localhost:8000. No build step or package installation is required. Google Fonts is optional; system fonts are used offline.

## Try it

- Filter the four products by paper goods or desk essentials.
- Add products to the bag, change quantities, remove items, and check the GBP subtotal.
- Reload: the bag is remembered in this browser using localStorage when available.
- Complete a **demo** order. No payment is collected and nothing is shipped.
- Explore with a keyboard. The modal bag supports Escape, focus containment and return to its trigger.

Prices use integer pence. Stored quantities are validated against the catalogue and capped at 99. There is no backend or real checkout. Product palettes are decorative; each listed product has one fixed colour.

## Files

- `index.html`: storefront and accessible bag dialog
- `contact.html`: project information, preserving the original page route
- `style.css`: shared responsive design
- `js.js`: catalogue, filters and cart state
- `assets/`: original SVG product artwork and favicon
