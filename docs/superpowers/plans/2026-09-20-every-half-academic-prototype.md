# Every Half Academic Landing Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a locally runnable, academic-only Every Half landing-page prototype with a working UTM CTA and inspectable client-side event log.

**Architecture:** A dependency-free static site uses `index.html` for the story page, `thank-you.html` as the CTA destination, a shared stylesheet, and a small tracking module. Generated image assets remain under `public/images/everyhalf`; the gallery documents them separately. Browser local storage provides a private, inspectable analytics sandbox with no network transmission.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, browser localStorage, PowerShell/Python static validation.

**Spec:** `docs/superpowers/specs/2026-09-20-every-half-academic-prototype-design.md`

## Global Constraints

- Display the exact Vietnamese notice “Bài tập học thuật – không phải trang chính thức của thương hiệu” on every prototype page.
- Use only assets in this workspace that are project-owned/generated; do not use logos, official brand claims, or external analytics.
- Do not collect forms, emails, names, contact details, or sensitive personal data.
- The CTA URL must include non-empty `utm_source`, `utm_medium`, and `utm_campaign` query parameters.
- Stored events must include event name, ISO timestamp, page URL, referrer, and parsed UTM fields.
- Record `cta_click` before navigation, retain all query parameters at the destination, and document a real test in `docs/tracking-evidence.md`.

---

### Task 1: Complete and catalogue visual assets

**Files:**
- Create: `public/images/everyhalf/people/11_human_moment.png`
- Create: `public/images/everyhalf/space/12_space.png`
- Create: `public/images/everyhalf/transition/13_transition_macro.png`
- Create: `public/images/everyhalf/organic/14_organic_01.png`
- Create: `public/images/everyhalf/organic/14_organic_02.png`
- Create: `public/images/everyhalf/organic/14_organic_03.png`
- Create: `public/images/everyhalf/organic/14_organic_04.png`
- Create: `public/images/everyhalf/texture/15_material_texture.png`
- Create: `public/images/everyhalf/closing/16_closing.png`
- Modify: `asset_gallery.html`

**Interfaces:**
- Consumes: prompts and paths from `EVERY_HALF_REMAINING_ASSETS_PROMPT.md`.
- Produces: final PNG asset paths used by the landing page and gallery.

- [ ] **Step 1: Generate each editorial/texture PNG using the supplied prompt, placing it in its specified directory.**

  Check each output with PowerShell:

  ```powershell
  Get-ChildItem public/images/everyhalf -Recurse -File | Select-Object FullName, Length
  ```

- [ ] **Step 2: Generate botanical source imagery on a flat chroma-key backdrop, then remove the key to create alpha PNGs.**

  Validate each transparent file:

  ```powershell
  Add-Type -AssemblyName System.Drawing
  $image = [System.Drawing.Image]::FromFile('public/images/everyhalf/organic/14_organic_01.png')
  $image.RawFormat; $image.Dispose()
  ```

- [ ] **Step 3: Add gallery cards that use each new final image path and a descriptive alt value.**

- [ ] **Step 4: Run static asset checks.**

  Run:

  ```powershell
  $expected = 'people/11_human_moment.png','space/12_space.png','transition/13_transition_macro.png','organic/14_organic_01.png','organic/14_organic_02.png','organic/14_organic_03.png','organic/14_organic_04.png','texture/15_material_texture.png','closing/16_closing.png'
  $expected | ForEach-Object { if (-not (Test-Path (Join-Path 'public/images/everyhalf' $_))) { throw "Missing $_" } }
  ```

### Task 2: Build the academic landing surface and CTA destination

**Files:**
- Modify: `index.html`
- Create: `thank-you.html`
- Create: `assets/css/every-half-prototype.css`

**Interfaces:**
- Consumes: image paths produced by Task 1 and `window.EveryHalfTracking` produced by Task 3.
- Produces: `#visit-roastery` CTA with a valid local URL and the `data-track="cta_click"` marker; a destination page that reads current URL parameters.

- [ ] **Step 1: Write a static HTML check that defines the expected safety and CTA assertions.**

  ```powershell
  $home = Get-Content index.html -Raw
  if ($home -notmatch 'Bài tập học thuật – không phải trang chính thức của thương hiệu') { throw 'Academic notice missing' }
  if ($home -notmatch 'id="visit-roastery"') { throw 'CTA missing' }
  if ($home -notmatch 'utm_source=academic_prototype&amp;utm_medium=landing_page&amp;utm_campaign=every_half_case_study') { throw 'UTM parameters missing' }
  ```

- [ ] **Step 2: Replace redirect-only `index.html` with a semantic, responsive story landing page.**

  Include a header notice, hero, origin/process/space/closing sections, a single primary `a` CTA, an event panel placeholder, and image alt text. Link `assets/css/every-half-prototype.css` and `assets/js/tracking.js`.

- [ ] **Step 3: Create `thank-you.html` that includes the same academic notice and a `#campaign-details` element for the received non-sensitive UTM values.**

  Use a back link without creating a form or storing user input.

- [ ] **Step 4: Add a responsive stylesheet with the specified basalt, gold, forest, charcoal, and plaster palette, plus `prefers-reduced-motion` support.**

- [ ] **Step 5: Run the static HTML check from Step 1.**

### Task 3: Add private event logging and UTM preservation display

**Files:**
- Create: `assets/js/tracking.js`
- Modify: `index.html`
- Modify: `thank-you.html`

**Interfaces:**
- Consumes: anchor elements marked `data-track`, browser `location`, `document.referrer`, and `localStorage`.
- Produces: `window.EveryHalfTracking.getEvents(): Array<EventRecord>`, `window.EveryHalfTracking.clear(): void`, events with `{name, timestamp, url, referrer, utm}` and rendered `#event-log` / `#campaign-details` content.

- [ ] **Step 1: Write a browser-free source check for the public tracking contract.**

  ```powershell
  $tracking = Get-Content assets/js/tracking.js -Raw
  foreach ($token in 'page_view','cta_click','timestamp','localStorage','URLSearchParams','EveryHalfTracking') {
    if ($tracking -notmatch [regex]::Escape($token)) { throw "Tracking contract missing $token" }
  }
  ```

- [ ] **Step 2: Implement `tracking.js`.**

  Define `parseUtm(search)`, `recordEvent(name)`, `getEvents()`, `clearEvents()`, `renderEventLog()`, and `renderCampaignDetails()`. Guard all storage reads/writes in `try/catch`; return a UI-readable error state while keeping CTA navigation alive.

- [ ] **Step 3: Bind the CTA click handler using a normal anchor navigation.**

  The handler must synchronously call `recordEvent('cta_click')`, then not call `preventDefault`, so the valid UTM URL stays visible in the navigation chain.

- [ ] **Step 4: Run the source check from Step 1 and static markup checks.**

### Task 4: Execute manual verification and preserve evidence

**Files:**
- Create: `docs/tracking-evidence.md`

**Interfaces:**
- Consumes: source page URL, CTA URL, browser localStorage event output, and destination `#campaign-details` text.
- Produces: a dated manual test record containing URL, navigation chain, UTM preservation outcome, event names, timestamps, and observed result.

- [ ] **Step 1: Start a local static server and open the prototype through a browser-capable test surface.**

  Run:

  ```powershell
  python -m http.server 4173
  ```

- [ ] **Step 2: Visit `http://localhost:4173/index.html`, click `#visit-roastery`, and capture the final destination URL and visible campaign values.**

- [ ] **Step 3: Inspect the on-page event panel or browser localStorage and capture `page_view` and `cta_click` timestamps.**

- [ ] **Step 4: Write `docs/tracking-evidence.md` with the observed values, pass/fail results, and concise reproduction steps.**

- [ ] **Step 5: Re-run static validation for all assets, notices, UTM parameters, event names, and evidence sections.**

## Self-Review

- Spec coverage: Tasks 1–4 cover all assets, academic disclosure, non-impersonation, CTA, valid UTM link, local event recording, real interaction evidence, and no personal-data collection.
- Placeholder scan: no implementation placeholders or undefined file paths remain.
- Interface consistency: Task 2 consumes `data-track="cta_click"`; Task 3 produces its event logger and reads the same marker; Task 4 validates the resulting link and event entries.
