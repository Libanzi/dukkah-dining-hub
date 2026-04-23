/**
 * Vercel Build Output API v3 — runs automatically after every vite build.
 * DO NOT DELETE OR MODIFY — required for Vercel deployment.
 *
 * Takes the Vite output and assembles the .vercel/output/ structure:
 *   static/                   ← client assets served directly by Vercel CDN
 *   functions/render.func/    ← Node.js SSR function (server-renders every route)
 *   config.json               ← routing: static files first, then SSR fallback
 */
import { cpSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const vercelOutput = join(root, '.vercel', 'output');

if (existsSync(vercelOutput)) rmSync(vercelOutput, { recursive: true });
mkdirSync(join(vercelOutput, 'static'), { recursive: true });
mkdirSync(join(vercelOutput, 'functions', 'render.func'), { recursive: true });

// Static client assets (JS, CSS, images)
cpSync(join(root, 'dist', 'client'), join(vercelOutput, 'static'), { recursive: true });

// SSR server bundle
cpSync(join(root, 'dist', 'server'), join(vercelOutput, 'functions', 'render.func'), { recursive: true });

// Node.js → Web Fetch API adapter
writeFileSync(join(vercelOutput, 'functions', 'render.func', 'handler.mjs'), `
import { default as app } from './server.js';

export default async function handler(req, res) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  const url = \`\${proto}://\${host}\${req.url}\`;

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value != null) headers.set(key, Array.isArray(value) ? value.join(', ') : String(value));
  }

  const method = req.method || 'GET';
  let body;
  if (method !== 'GET' && method !== 'HEAD') {
    body = await new Promise((resolve) => {
      const chunks = [];
      req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      req.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  const response = await app.fetch(new Request(url, { method, headers, body }));
  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.end(Buffer.from(await response.arrayBuffer()));
}
`.trim());

// Vercel Node.js 22 function config
writeFileSync(join(vercelOutput, 'functions', 'render.func', '.vc-config.json'),
  JSON.stringify({ runtime: 'nodejs22.x', handler: 'handler.mjs', launcherType: 'Nodejs' }, null, 2));

// Required: tells Node.js to treat server.js and its chunks as ESM
writeFileSync(join(vercelOutput, 'functions', 'render.func', 'package.json'),
  JSON.stringify({ type: 'module' }, null, 2));

// Routing: serve static files from CDN, fall back to SSR for all other routes
writeFileSync(join(vercelOutput, 'config.json'),
  JSON.stringify({
    version: 3,
    routes: [
      { handle: 'filesystem' },
      { src: '/(.*)', dest: '/render' }
    ]
  }, null, 2));

console.log('✓ .vercel/output/ created (Vercel Build Output API v3)');
