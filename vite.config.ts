// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// IMPORTANT — do not remove these options or Vercel deployment breaks:
// cloudflare: false  → builds a Node.js h3 SSR server instead of a Cloudflare Worker
// ssr.noExternal     → bundles all npm deps inline so the Vercel function is self-contained
export default defineConfig({
  cloudflare: false,
  vite: {
    ssr: {
      noExternal: true,
    },
  },
});
