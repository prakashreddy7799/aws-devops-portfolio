import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import react from '@vitejs/plugin-react';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const staging = path.join(projectRoot, 'standalone-v6');
const manifestPath = path.join(staging, 'engineering-bundle.json');

if (!process.argv.includes('--inject')) {
  const result = await build({
    configFile: false,
    root: projectRoot,
    plugins: [react()],
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    publicDir: false,
    build: {
      write: false,
      cssCodeSplit: false,
      minify: 'esbuild',
      target: 'es2020',
      lib: { entry: path.join(projectRoot, 'scripts/standalone-v6-entry.jsx'), name: 'PortfolioEngineering', formats: ['iife'] },
      rollupOptions: { output: { inlineDynamicImports: true } },
    },
  });
  const outputs = (Array.isArray(result) ? result : [result]).flatMap((item) => item.output);
  const code = outputs.filter((item) => item.type === 'chunk').map((item) => item.code).join('\n');
  const css = outputs.filter((item) => item.type === 'asset' && item.fileName.endsWith('.css')).map((item) => String(item.source)).join('\n');
  if (!code || !css || outputs.some((item) => item.type === 'chunk' && (item.imports.length || item.dynamicImports.length))) throw new Error('Expected a complete inline bundle with no runtime imports.');
  await writeFile(manifestPath, JSON.stringify({ code, css }));
  console.log(`Built offline widgets: ${(Buffer.byteLength(code) / 1024).toFixed(0)} KB JavaScript, ${(Buffer.byteLength(css) / 1024).toFixed(0)} KB CSS.`);
}

if (!process.argv.includes('--bundle-only')) {
  const { code, css } = JSON.parse(await readFile(manifestPath, 'utf8'));
  const htmlPath = path.join(staging, 'index.html');
  let html = await readFile(htmlPath, 'utf8');
  if (html.includes('id="engineering-experiences"')) throw new Error('Engineering widgets already injected; prepare a fresh staged HTML first.');
  const section = /<section\b(?=[^>]*\bid=["']work["'])[^>]*>[\s\S]*?<\/section>/i;
  if (!section.test(html)) throw new Error('Existing work section was not found.');
  html = html.replace(section, (match) => `${match}\n<div id="engineering-experiences"><p class="v6-widget-loading">Loading interactive engineering experiences…</p></div>`);
  html = html.replace(/<\/head>/i, () => `<style id="engineering-widget-styles">${css.replace(/<\/style/gi, '<\\/style')}</style>\n</head>`);
  html = html.replace(/<\/body>/i, () => `<script id="engineering-widget-runtime">${code.replace(/<\/script/gi, '<\\/script')}</script>\n</body>`);
  await writeFile(htmlPath, html, 'utf8');
  console.log(`Updated candidate: ${htmlPath}`);
}
