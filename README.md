# TRIP — Teatro Laboratorio

Landing page for TRIP Teatro Laboratorio, Santa Fe, Argentina.

## Stack

- React + Vite + TypeScript
- Motion for the bubble-to-word reveal and route interactions
- Originkit **Cluster About Glossy** base preset for the original WebGL metaball/shader component
- Cloudflare Workers static assets

## Local development

```bash
npm install
npx originkit@latest add cluster-about-glossy --base --path src/components/ui
npm run dev
```

The Originkit CLI requires an authenticated Originkit account. For CI, add a repository Actions secret named `ORIGINKIT_API_KEY`. The source is installed from Originkit during the workflow; it is not reimplemented or replaced with a visual approximation.

## Deploy

The GitHub Actions workflow tests, builds and deploys `main` to the Worker named `trip`. It uses the existing repository secrets `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`, plus `ORIGINKIT_API_KEY` to retrieve the component source.

## Acceptance checks

```bash
npm test
npm run build
```

The live deployment is considered complete only after the Actions workflow succeeds and the Worker URL returns the built site.
