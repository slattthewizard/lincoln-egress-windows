import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = 'https://lincolnegresswindows.com';

// Per-post lastmod from blog frontmatter (updatedDate wins over publishedDate)
const blogDir = fileURLToPath(new URL('./src/content/blog', import.meta.url));
const lastmods = {};
for (const f of fs.readdirSync(blogDir)) {
  if (!f.endsWith('.md')) continue;
  const raw = fs.readFileSync(path.join(blogDir, f), 'utf8');
  const updated = raw.match(/^updatedDate:\s*"([^"]+)"/m);
  const published = raw.match(/^publishedDate:\s*"([^"]+)"/m);
  const date = (updated || published)?.[1];
  if (date) lastmods[`${SITE}/blog/${f.replace(/\.md$/, '')}/`] = date;
}

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      serialize(item) {
        const lastmod = lastmods[item.url];
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
  ],
});
