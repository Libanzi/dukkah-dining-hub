/**
 * Vercel Build Output API v3 — runs automatically after every vite build.
 * DO NOT DELETE OR MODIFY — required for Vercel deployment.
 *
 * Takes the Vite output and assembles the .vercel/output/ structure:
 *   static/                   ← client assets served directly by Vercel CDN
 *   functions/render.func/    ← Node.js SSR function (server-renders every route)
 *   config.json               ← routing: static files first, then SSR fallback
 */
import { cpSync, mkdirSync, writeFileSync, rmSync, existsSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');

// ---- validate build output exists -----------------------------------------
const clientDir = join(root, 'dist', 'client');
const serverDir = join(root, 'dist', 'server');
const serverEntry = join(serverDir, 'server.js');

if (!existsSync(clientDir)) {
  console.error('ERROR: dist/client not found — vite build must have failed.');
  process.exit(1);
}
if (!existsSync(serverDir)) {
  console.error('ERROR: dist/server not found — SSR build must have failed.');
  process.exit(1);
}
if (!existsSync(serverEntry)) {
  console.error(`ERROR: ${serverEntry} not found — server entry point is missing.`);
  console.error('Files in dist/server:', statSync(serverDir).isDirectory()
    ? 'see above'
    : 'dist/server is not a directory');
  process.exit(1);
}

// ---- assemble .vercel/output/ ---------------------------------------------
const vercelOutput = join(root, '.vercel', 'output');
const funcDir = join(vercelOutput, 'functions', 'render.func');

if (existsSync(vercelOutput)) rmSync(vercelOutput, { recursive: true });
mkdirSync(join(vercelOutput, 'static'), { recursive: true });
mkdirSync(funcDir, { recursive: true });

// Static client assets (JS, CSS, images, public/ files)
cpSync(clientDir, join(vercelOutput, 'static'), { recursive: true });
console.log('✓ Copied dist/client → .vercel/output/static');

// SSR server bundle + assets
cpSync(serverDir, funcDir, { recursive: true });
console.log('✓ Copied dist/server → .vercel/output/functions/render.func');

// Node.js ↔ Web Fetch API adapter
// server.js exports `server as default`; server.fetch handles each request.
writeFileSync(join(funcDir, 'handler.mjs'), `
import app from './server.js';

export default async function handler(req, res) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host  = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  const url   = \`\${proto}://\${host}\${req.url}\`;

  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (v != null) headers.set(k, Array.isArray(v) ? v.join(', ') : String(v));
  }

  let body;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = await new Promise((resolve) => {
      const chunks = [];
      req.on('data', (c) => chunks.push(Buffer.from(c)));
      req.on('end',  () => resolve(Buffer.concat(chunks)));
    });
  }

  let response;
  try {
    response = await app.fetch(new Request(url, { method: req.method, headers, body }));
  } catch (err) {
    console.error('SSR error:', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
    return;
  }

  res.statusCode = response.status;
  response.headers.forEach((v, k) => res.setHeader(k, v));
  res.end(Buffer.from(await response.arrayBuffer()));
}
`.trim());

// Vercel Node.js 22 function config
// shouldAddHelpers:false  — we handle req/res ourselves, no helper pollution needed
// supportsResponseStreaming:false — send full buffer, avoids streaming edge-cases
writeFileSync(join(funcDir, '.vc-config.json'), JSON.stringify({
  runtime: 'nodejs22.x',
  handler: 'handler.mjs',
  launcherType: 'Nodejs',
  shouldAddHelpers: false,
  supportsResponseStreaming: false,
}, null, 2));

// ESM marker so Node treats server.js and chunks as ES modules
writeFileSync(join(funcDir, 'package.json'), JSON.stringify({ type: 'module' }, null, 2));

// Routing: filesystem first (static assets from CDN), then SSR for everything else
writeFileSync(join(vercelOutput, 'config.json'), JSON.stringify({
  version: 3,
  routes: [
    { handle: 'filesystem' },
    { src: '/(.*)', dest: '/render' },
  ],
}, null, 2));

console.log('✓ .vercel/output/ assembled (Vercel Build Output API v3)');
console.log('  static/ :', join(vercelOutput, 'static'));
console.log('  render  :', funcDir);
