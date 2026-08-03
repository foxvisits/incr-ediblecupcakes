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
- Scheduled-workflow upkeep: `docs/AUTOMATION.md`

`lastmod` in the sitemap is derived from real content dates, never from "today".
Listing pages inherit the date of the freshest item they list; hand-written
pages use `EDITORIAL_LASTMOD` in `scripts/lib/collect-urls.mjs`, which you bump
when the copy actually changes. Rebuilding without a content change produces a
byte-identical sitemap on purpose — a sitemap that claims all 96 URLs changed
every night teaches Google to ignore the signal.

## Known state (2026-08-03)

Google had indexed **4** of the site's 96 URLs; 14 more were "Crawled –
currently not indexed", and the remaining ~78 had never been discovered. Web
search delivered ~5 clicks per quarter. AI-surface citations, by contrast, were
growing (roughly 4–17/day in June to 20–67/day in late July). Read
`docs/AUTOMATION.md` before assuming the publishing pipeline is the bottleneck.
