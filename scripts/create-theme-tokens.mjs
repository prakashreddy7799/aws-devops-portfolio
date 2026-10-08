import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
// A compatibility token layer preserves the existing gradients and visual hierarchy.
// New UI can use --page, --surface, --ink, --secondary, --accent and --line directly.
const root = path.resolve('src');
const files = (await readdir(root, { recursive: true }))
  .filter((file) => file.endsWith('.css') && !file.endsWith('themes.css'))
  .map((file) => path.join(root, file));
const colors = new Set();
const regex = /#(?:[\da-f]{8}|[\da-f]{6}|[\da-f]{4}|[\da-f]{3})\b/gi;
for (const file of files) {
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(regex)) colors.add(match[0].toLowerCase());
}
const previous = path.join(root, 'styles/theme-colors.json');
try {
  for (const color of JSON.parse(await readFile(previous, 'utf8'))) colors.add(color);
} catch {}
function palette(hex, light) {
  let value = hex.slice(1);
  if (value.length <= 4) value = [...value].map((char) => char + char).join('');
  const rgb = value.slice(0, 6),
    alpha = value.slice(6);
  const [r, g, b] = [0, 2, 4].map((index) => parseInt(rgb.slice(index, index + 2), 16));
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const saturation = (Math.max(r, g, b) - Math.min(r, g, b)) / Math.max(1, r, g, b);
  let color;
  if (lum < 0.32 && !(saturation > 0.65 && lum > 0.25)) {
    color = light
      ? b > r * 1.2
        ? '#edf3fa'
        : '#f8fafc'
      : lum < 0.07
        ? '#090d17'
        : lum < 0.17
          ? '#111827'
          : lum < 0.25
            ? '#172033'
            : '#283446';
  } else if (!light) {
    color = '#' + rgb;
  } else if (saturation < 0.35) {
    color = lum > 0.82 ? '#0f172a' : '#475569';
  } else if (saturation > 0.2 && r > g * 1.2 && r > b * 1.2) {
    color = g > r * 0.65 ? '#8a4b0f' : '#ad2531';
  } else if (saturation > 0.15 && g > r * 1.12 && g > b * 0.95) {
    color = '#146747';
  } else if (saturation > 0.15 && b > r * 1.08) {
    color = lum > 0.65 ? '#173c68' : '#245c9c';
  } else {
    color = lum > 0.58 ? '#0f172a' : '#475569';
  }
  if (alpha) {
    if (r === g && g === b && r < 40) color = light ? '#0f172a' : '#020611';
    if (r > 230 && g > 230 && b > 230) color = light ? '#173354' : '#ffffff';
    color += alpha;
  }
  return color;
}
const all = [...colors].sort();
const definitions = (light) =>
  all.map((color) => `  --color-${color.slice(1)}: ${palette(color, light)};`).join('\n');
const theme = `/* Theme tokens for existing components: preserve hue roles without color inversion. */
:root,html[data-theme='dark'] { --page:#090D17; --surface:#111827; --card:#172033; --ink:#F8FAFC; --secondary:#94A3B8; --accent:#3B82F6; --line:#283446; color-scheme:dark;
${definitions(false)}
}
html[data-theme='light'] { --page:#F8FAFC; --surface:#F1F5F9; --card:#FFFFFF; --ink:#0F172A; --secondary:#475569; --accent:#2563EB; --line:#E2E8F0; color-scheme:light;
${definitions(true)}
}
html { color:var(--ink); background:var(--page); }
body { background:var(--page); color:var(--ink); }
:root { --background:var(--page); --surface:var(--card); --blue:var(--accent); --muted:var(--secondary); --border:var(--line); }
.button-primary { color:#fff; background:var(--accent); border-color:var(--accent); }
.button-primary:hover { background:var(--accent); filter:brightness(1.08); }
html .button-primary { background:#2563eb; color:#fff; border-color:#2563eb; }
html .button-primary:hover { background:#1d4ed8; filter:none; }
html .env-controls button[aria-pressed='true'], html .playground-control-panel [role='tab'][aria-selected='true'] { background:#2563eb; color:#fff; border-color:#2563eb; }
html[data-theme='dark'] .gradient-text { background-image:linear-gradient(110deg,#99d8ff,#60a5fa,#a49aff); }
html[data-theme='light'] .site-header .header-inner { background:#fffffff0; border-color:var(--line); }
html[data-theme='light'] .navigation.is-open { background:#f8fafcfa; }
html[data-theme='light'] .hero-portrait figcaption { background:linear-gradient(transparent,#f8fafcf5 75%); }
html[data-theme='light'] .hero-portrait strong { color:var(--ink); }
html[data-theme='light'] .hero-portrait figcaption > span { color:#234e7b; }
html[data-theme='light'] .ej-case-study,html[data-theme='light'] .tf-case-study,html[data-theme='light'] .showcase-card,html[data-theme='light'] .skill-card { background:var(--card); border-color:var(--line); box-shadow:0 8px 30px #17335406; }
html[data-theme='light'] .text-muted { color:var(--secondary); }
html[data-theme='light'] .gradient-text { background-image:linear-gradient(110deg,#174278,#2563eb,#574eb8); }
html[data-theme='light'] :is(.ci-primary,.obs-primary) { background:#2563eb; color:#fff; }
html[data-theme='light'] :is(.arch-stage,.tf-infra-node,.env-node,.ci-stage) { border-color:#b3c7dc; }
html[data-theme='light'] :is(.arch-stage,.tf-infra-node,.env-node,.ci-stage).is-selected { border-color:#2563eb; background:#e6f0ff; }
html[data-theme='light'] .ci-state-dot,html[data-theme='light'] .status-dot { background:#147a50; }
html[data-theme='light'] .ej-journey { background:#fffffff2; }
html[data-theme='light'] .site-footer { background:var(--surface); }
html[data-theme='light'] .icon-button { color:#35516f; }
html[data-theme='light'] .tag { border-color:#c5d6e7; }
html[data-theme='light'] :is(.hero-description,.body-copy,.section-heading>p,.principle p) { color:var(--secondary); }
@media(prefers-reduced-motion:no-preference) { body { transition:background-color .2s,color .2s; } }
`;
await writeFile(path.join(root, 'styles/themes.css'), theme);
await writeFile(previous, JSON.stringify(all, null, 2) + '\n');
for (const file of files) {
  let source = await readFile(file, 'utf8');
  source = source.replace(regex, (color) => `var(--color-${color.slice(1).toLowerCase()})`);
  if (file.endsWith('styles.css'))
    source = source.replace('@media (max-width: 1020px)', '@media (max-width: 1200px)');
  await writeFile(file, source);
}
console.log(`Generated ${all.length} paired color tokens across ${files.length} stylesheets.`);
