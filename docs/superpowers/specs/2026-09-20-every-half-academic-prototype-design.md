# Every Half Academic Landing Prototype — Design

## Purpose

Create a clearly labelled academic-only landing-page prototype for a coffee-roasting case study. It will use only project-owned/generated visual assets, will not claim to be an official brand property, and will not collect personal or sensitive data.

## Experience

`index.html` becomes the prototype entry page. A persistent notice states: “Bài tập học thuật – không phải trang chính thức của thương hiệu”. The page tells a short “Living Journey” story using the Every Half asset sequence, then offers a single primary CTA.

The CTA is a real link to the local `thank-you.html` destination. Its `href` contains valid `utm_source`, `utm_medium`, and `utm_campaign` parameters. The destination preserves and displays the received campaign parameters only as non-sensitive demo data.

## Tracking Sandbox

`assets/js/tracking.js` provides a small, inspectable local event logger. It records `page_view` and `cta_click` entries in `localStorage`, with an ISO timestamp, event name, current URL, referrer, and parsed UTM parameters. A compact event panel lets a reviewer inspect and clear the stored entries. The CTA handler writes `cta_click` before allowing browser navigation.

No external analytics SDK, network request, form field, cookie banner, account creation, or personal-data collection is included.

## Asset Strategy

Complete the remaining image files specified in `EVERY_HALF_REMAINING_ASSETS_PROMPT.md`. Editorial scenes retain usable negative space and contain no branding or text. Botanical PNGs are generated on a flat chroma-key background and post-processed into transparent PNGs. `asset_gallery.html` receives cards for the new files.

## Evidence

`docs/tracking-evidence.md` documents a real local test: source URL, CTA URL with UTM parameters, redirect/navigation chain, parameter preservation result, event names, timestamps, and observed logger result. It includes reproducible manual verification steps and is updated only after the local interaction has been executed.

## Error Handling and Accessibility

The prototype uses semantic landmarks, an accessible CTA label, reduced-motion support, image alt text, and robust UTM parsing with missing values represented as `null`. If local storage is unavailable, the page stays usable and reports the logger limitation in the event panel.
