# Incr-EdibleCupCakes

Static Astro site for home-tested cupcake recipes and baking guides.

## Commands

```bash
npm install
npm run dev          # local dev server
npm run build        # sitemap update + production build
npm run preview      # preview dist/
npm run seo-check    # SEO health script
npm run update-sitemap
npm run content:run         # import ideas.txt → AI → schedule (main command)
npm run content:status      # pipeline queue overview
node scripts/generate-favicons.mjs  # after public/favicon-source.png exists
```

See **`content/README.md`** for the full recipe publishing pipeline (ideas → AI → schedule → auto-publish).

## Deploy

- Host: Netlify (`netlify.toml`)
- Publish directory: `dist`
- After deploy: request indexing per `docs/GSC_REINDEX_QUEUE.md`

## SEO maintenance

- Sitemap: `public/sitemap.xml` (regenerated on build)
- LLM crawl hints: `public/llms.txt`
- Re-index queue: `docs/GSC_REINDEX_QUEUE.md`
- Content roadmap: `docs/CONTENT_CALENDAR.md`
