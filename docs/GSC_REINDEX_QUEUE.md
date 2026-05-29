# GSC / Bing - kolejka re-index (po deploy)

## Bing Webmaster Tools (recznie)
1. Submit sitemap: `https://incr-ediblecupcakes.com/sitemap.xml`
2. URL Submission: `/`, `/recipes`, `/guides`, `/about`
3. Top przepisy: classic-vanilla-dream, keto-chocolate-bliss, yellow-cake-cupcakes, mango-coconut-sunset, chocolate-chili-firecracker
4. Top guides: why-do-cupcakes-sink, fix-cupcake-mistakes, how-to-make-cupcakes-moist-every-time
5. Wlacz email alerts dla crawl errors

## Google Search Console - Request indexing (kolejnosc)
1. `/`
2. `/recipes`
3. `/about`
4. `/recipe/keto-chocolate-bliss-cupcakes`
5. `/categories/keto`
6. `/recipe/yellow-cake-cupcakes`
7. `/categories/classic`
8. `/recipe/mango-coconut-sunset-cupcakes`
9. `/recipe/chocolate-chili-firecracker-cupcakes`
10. `/categories/nut-free`
11. `/contact`

Powtarzac co 2 tygodnie max. Oczekiwanie: 2-4 tyg. na zmiane statusu "Crawled - not indexed".

## Metryki
- 14 dni: min. 3/10 z listy not-indexed -> indexed
- 30 dni: 6/10
- 60 dni: 10/10 + total indexed 25+
