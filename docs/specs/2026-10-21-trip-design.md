# TRIP — design and implementation brief

## Goal
A responsive Spanish-language site for TRIP Teatro Laboratorio in Santa Fe, with three discoverable workshop routes: CLOWN, BUFÓN and MÁSCARAS.

## Visual direction
Dark editorial canvas; expressive oversized typography; amber, red and violet route accents; tactile glossy bubbles; sparse copy and strong whitespace. Hero sequence: bubbles converge into the word TRIP, disperse, then reveal three interactive route circles. Respect prefers-reduced-motion and provide a non-animated fallback.

## Technical approach
React + Vite + TypeScript, Motion for the staged bubble/text and navigation transitions, Originkit Cluster About Glossy as the actual WebGL backdrop, Cloudflare Worker static assets. The official Originkit CLI can install the base preset to src/components/ui/cluster-about-glossy-base.tsx; CI must receive ORIGINKIT_API_KEY to fetch source in a non-interactive runner. Deploy only after tests and build pass.

## Routes and content
Single-page anchors for CLOWN, BUFÓN and MÁSCARAS. Copy stays deliberately concise and avoids invented schedules, prices, instructors, or contact details. Social links point to the supplied Facebook and Instagram profiles.

## Acceptance checks
- The original Originkit source is installed by the official CLI, not reimplemented.
- The hero reveals TRIP, then the three interactive routes.
- Each route circle navigates to its own section.
- Mobile layout remains usable; reduced-motion disables the long entrance sequence.
- Tests and production build pass before Cloudflare deployment.
