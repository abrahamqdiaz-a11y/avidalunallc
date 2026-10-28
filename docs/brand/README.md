# Brand files

Drop Shary's files here with these exact names, then rebuild/redeploy. The site picks them up automatically
(any of .svg, .png, .webp, .jpg).

| File | Used for |
| --- | --- |
| `logo.*` | Her real logo, in the header and footer. SVG preferred; a PNG at least 400px tall with a transparent background also works. |
| `logo-horizontal.*` | Optional wide version for the header. Only use a version Shary has approved. |
| `shary.*` | Professional portrait for the home hero and About page. Portrait orientation (4:5), at least 1200px wide. |
| `shary-alt.*` | Optional second photo for the "Meet your nurse" section. Falls back to `shary.*`. |

## Current files

- `public/brand/logo.png`: Shary's logo (stacked), trimmed from the 360px file she supplied. A larger original or SVG
  from her designer would look sharper in the header.
- `public/brand/shary-hero.webp`: home hero photo, 1067 × 1600, outdoor portrait in scrubs.
- `public/brand/shary.webp`: her photo, 427 × 640. Usable, but soft on large screens. Replace with the full-resolution
  original (at least 1200px wide) when available.
- `docs/brand/logo-horizontal-mockup.png`: **mock-up for Shary to approve**, built by placing her mark beside her
  wordmark. It is not live. If she approves, have her designer export a clean version and save it as
  `public/brand/logo-horizontal.png` (or `.svg`); the header switches to it automatically.
