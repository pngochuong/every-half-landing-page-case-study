# Every Half Motion Addendum

**Goal:** Add stable Vietnamese typography and a reduced-motion-safe “Living Journey” animation layer to the academic landing prototype.

- [ ] Add static checks for a Vietnamese-safe font stack, motion script, reveal selectors, and reduced-motion handling; verify they fail first.
- [ ] Replace the unresolvable `Inter` font token with local Windows/browser font stacks that support Vietnamese diacritics.
- [ ] Add `assets/js/motion.js` using `IntersectionObserver`, request-animation-frame parallax, and a reduced-motion exit path.
- [ ] Add data attributes and four organic floating elements to the landing markup.
- [ ] Add CSS keyframes for a restrained hero light, section reveal, botanical drift, and CTA shimmer.
- [ ] Verify the animation with Playwright at desktop and mobile viewports, then perform the real CTA click and capture tracking evidence.
