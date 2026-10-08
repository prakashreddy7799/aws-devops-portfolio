# Chandra Prakash Reddy — AWS DevOps Portfolio

An original light/dark portfolio built on the existing React 19 / Vite project. Editorial typography, restrained Motion animations, and interactive engineering case studies explain AWS infrastructure, delivery, observability, and enterprise migration.

## Run locally

Use Node.js **20.19+** (Node 22 LTS recommended) and npm.

```bash
npm install
npm run dev
```

Open the address Vite prints, normally `http://localhost:5173`.

```bash
npm run build
npm run preview
```

The production build is generated in `dist/`; preview normally runs at `http://localhost:4173`.

## Edit the portfolio

| File | Purpose |
| --- | --- |
| `src/content.js` | Personal details, metrics and context, skill groups, professional experience, projects, learning roadmap, architecture explanations, and section copy |
| `src/App.jsx` | Page composition and deferred architecture mounting |
| `src/components/` | Navigation, hero, SVG architecture explorer, about, skills, expandable work stories, resume, contact, footer, and shared reveals |
| `src/hooks/useMotionPreferences.jsx` | System reduced-motion preference and manual animation pause |
| `src/hooks/useTheme.jsx` / `src/styles/themes.css` | Persisted light/dark preference and global theme tokens; the early script in `index.html` prevents theme flashing |
| `src/components/DevOpsPlayground.jsx` / `ProjectShowcase.jsx` | Accessible experience tabs and five project entry points that reuse the walkthroughs |
| `src/components/*CaseStudy.jsx` / `src/*CaseStudy.js` | Terraform, environment architecture, Jenkins pipeline, CloudWatch incident, and migration experiences and sanitized data |
| `src/styles.css` | Shared design tokens, typography, responsive layouts, component styles |
| `src/styles/architecture.css` / `work.css` | Architecture and professional work visuals |
| `src/styles/animations.css` | Shared keyframes, pause behavior, reduced-motion overrides |
| `public/resume.pdf` | Original downloadable resume, preserved unchanged |
| `public/portrait.jpg` | Optimized hero portrait; selected with `profile.photo` in `src/content.js` |
| `public/social-card.svg` / `.png` | Original source artwork and raster social sharing preview |
| `index.html` | Page title, description, Open Graph, Twitter metadata, and Person structured data |
| `netlify.toml` | Build, routing, security headers, and asset caching |

Run `npm run format` after editing to apply the shared Prettier configuration.

The hero's visible line breaks are controlled by `profile.heroLines`; its supporting paragraph is `profile.heroIntro`. Other section headings and introductions live in `sectionCopy`.

Professional metrics are tied to their engagement and scope. Overlapping FiberZ ISP and Bank of Maharashtra dates are intentionally preserved. Certification study is labeled **In preparation**, rather than an earned credential. Professional project descriptions summarize the resume. GitHub profile and repository links are omitted at the owner's request; GitHub Actions skills and the conceptual source-control stage remain part of the technical content.

## Interactions and accessibility

- Native scrolling with section links and active navigation; no scroll interception.
- Mobile navigation supports Escape, a contained Tab loop, focus return, and closing on selection.
- Architecture nodes are real buttons with keyboard interaction and announced explanations.
- The multi-environment canvas supports mouse dragging, keyboard arrow-key panning, zoom, fit, reset, and simulated request playback. Terraform provisioning and NAT egress are distinct from application ingress.
- Jenkins supports play, pause, resume, replay, EKS/ECS selection, failure injection, and a guided recovery. CloudWatch includes synthetic charts, searchable sample logs, alarms, and a guided incident.
- The migration journey has twelve inspectable steps. Each new case study includes an interview deep dive; code examples support clipboard copying and a selectable fallback.
- The DevOps Playground links to the existing simulations. Its tabs and dashboard tabs support arrow keys, Home, and End. Skills support search and category filtering.
- The sun/moon control persists an explicit choice; first visits follow the operating-system color preference. All walkthroughs support both themes.
- Hover or keyboard focus animates the “One change. An entire ecosystem.” diagram. Pointer-follow lighting, node elevation, and connection motion respect reduced motion and the header pause control.
- Project and experience cards use native keyboard-operable `details` / `summary` disclosures.
- System `prefers-reduced-motion` disables continuous motion and parallax. The pause control in the header also stops continuous animation and role rotation.
- Metrics count up once when they become visible; the final values remain available to assistive technology.
- System fonts and local SVG assets avoid third-party font/image requests. The detailed architecture mounts near the viewport.
- Motion supplies reveal and parallax effects. GSAP is unnecessary for this interaction scope, keeping the animation dependency small.

## Browser checks

```bash
npm test
```

The Playwright suite checks all six requested widths (320, 375, 768, 1024, 1440, 1920), overflow, links and the PDF download, keyboard navigation and disclosures, architecture interaction, reduced motion, animation pause, and automated axe accessibility rules. Browser exceptions fail the tests.

Additional checks cover theme persistence, timed and manual pipeline playback, failure recovery, incident investigation, migration steps, canvas controls, skills filtering, cursor animation, both-theme mobile layouts, and project accessibility. Demo interactions are checked for unexpected AWS requests. The 45% provisioning-effort and 35% MTTR reductions remain resume achievements; chart values and logs are clearly fictional.

The test configuration uses an installed Microsoft Edge or Chrome on Windows. Elsewhere, install Playwright Chromium:

```bash
npx playwright install chromium
```

You can select another Chromium executable using the `PLAYWRIGHT_EXECUTABLE_PATH` environment variable. Run `npm run test:ui` for the interactive test runner. Failure traces and screenshots are kept in ignored `test-results/`; these files are not deployed.

To test an existing production build in PowerShell, run `$env:PORTFOLIO_TEST_PREVIEW='1'; npm test`. The suite uses preview port 4173 in that mode. With preview running, `node scripts/capture-preview.mjs` regenerates the sharing image and captures desktop/mobile screenshots; rebuild afterward to include the PNG in `dist/`.

Use `node scripts/capture-preview.mjs --social-only` to regenerate only the Open Graph PNG. Theme compatibility tokens can be regenerated with `node scripts/create-theme-tokens.mjs`; new UI should prefer semantic variables such as `--page`, `--card`, `--ink`, `--secondary`, and `--accent`.

Lighthouse scores are targets rather than guarantees. Audit the final deployed URL to measure performance, accessibility, best practices, and SEO under real hosting conditions.

## GitHub and Netlify

Review the changes with `git diff`, then commit and push using the existing repository and branch workflow. This redesign does not publish or push automatically.

To deploy through Netlify:

1. Import the existing GitHub repository in Netlify.
2. Use build command `npm run build` and publish directory `dist`.
3. The included `netlify.toml` selects Node 22 and preserves SPA fallback routing. Actual assets, including the PDF, take precedence over the fallback.
4. Netlify can deploy subsequent pushes to the selected production branch.

After choosing the final public domain, add a canonical link and `og:url` in `index.html`, and change `og:image` / `twitter:image` to the absolute public URL of `/social-card.png` for consistent sharing previews. No deployment domain is guessed in the repository.

The website runs entirely in the browser with no backend, paid assets, credentials, or external API requirement. LinkedIn, email, and the resume are ordinary user-initiated links.
