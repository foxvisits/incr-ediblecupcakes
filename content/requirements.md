# Wymagania jakości — edytuj RAZ, pipeline stosuje je do każdej treści

Źródło prawdy dla generatora AI, post-processingu (`scripts/content/lib/text-cleanup.mjs`) i QA przed publikacją.

---

## ZAKAZANE (zero tolerancji)

### Interpunkcja
- **Em dash (—) i en dash (–)** — nigdy w żadnym polu (body, FAQ, alt, prompt, nagłówki, meta).
- Używaj: przecinka, kropki, dwukropka lub „to” / „and” zamiast myślnika łączącego myśli.

### Słownictwo AI (nigdy)
`delve`, `unlock`, `leverage`, `robust`, `seamless`, `elevate`, `crucial`, `comprehensive`, `utilize`, `tapestry`, `realm`, `plethora`, `myriad`, `symphony`, `revelation`, `whimsical` (chyba że dosłownie o dekoracji), `mid-palate`, `flavor story`, `framework` (użyj: plan, chart, method), `hero ingredient` (użyj: main flavor), `flavor profile` (użyj: flavor mix).

### Marketing fluff (nigdy)
„game-changer”, „mouth-watering”, „pure bliss”, „extraordinary journey”, „elevate your baking”, „rabbit hole” (chyba że cytat w cudzysłowie).

---

## Czytelność (content-readability-seo-geo) — OBOWIĄZKOWE

Każdy przepis i guide musi spełniać trzy filary:

1. **Krótsze zdania** — średnio 12–18 słów; max ~22 w instrukcjach technicznych.
2. **Prostsze słowa** — blog kulinarny, nie essay; „use” nie „utilize”, „mix” nie „incorporate thoroughly”.
3. **Listy i podnagłówki** — kroki, porównania i kryteria w `ul`/listach JSON; max **2 zdania na akapit** w sekcjach guide.

### Struktura sekcji (GEO / snippet)
- Pod każdym H2: **odpowiedź w pierwszym zdaniu** (40–60 słów max w leadzie).
- Akapity **samodzielne** — cytowalne bez kontekstu strony.
- Brak „ścian tekstu”: sekcja >400 słów bez listy = błąd.

### Głos
- Sarah — domowa piekarka, praktyczna, rozmowna, jak do znajomej.
- Perspektywa: „przetestowałam w domowej kuchni”.
- Spójny ton z istniejącymi treściami na incr-ediblecupcakes.com.

---

## Pola JSON — co wolno, czego nie ruszać

### Treść (sanitize + readability pass)
`title`, `desc`, `description`, `shortDescription`, `summaryShort`, `conclusion`, `metaDescription`, `sections[].heading`, `sections[].paragraphs[]`, `sections[].list[]`, `howToSteps[]`, `instructions[]`, `tips[]`, `faq[]`, `sidebarBullets[]`, `table`, `images[].alt`, `images[].prompt`.

### Struktura (NIGDY nie modyfikować przez cleanup)
`slug`, `id`, `src`, `image`, `role`, `category`, `difficulty`, `prepTime`, `cookTime`, `totalTime`, `servings`, `ingredients[]`, `tags[]`, `keywords[]`, `relatedSlugs[]`, `href`, `publishAt`, `datePublished`, `dateModified`.

Po każdej generacji uruchom: `npm run content:cleanup`

---

## Obrazy w layoutcie strony
- **Hero:** tylko 1 zdjęcie (`role: hero`).
- **Body:** `process` + `detail` między sekcjami (nie w hero).
- JSON `images`: dokładnie 3 obiekty (hero, process, detail).
- Prompty i alt: bez em dash; opisują to, co widać + kontekst.

---

## Przepisy — techniczna poprawność
- Miary US (cups, tsp, °F).
- Składniki: min. 8; kroki: min. 6.
- Badge dietetyczne tylko gdy przepis spełnia kryterium.
- Bez pól `rating` / `featured` w generated JSON.

---

## Guide'y — techniczna poprawność
- Min. 5 sekcji z `heading` + 1–3 krótkie akapity + opcjonalna lista.
- `howToSteps`: 5–8 kroków (HowTo schema).
- FAQ: min. 4 pytania specyficzne dla tego guide'a.
- `sidebarTitle` + 4–6 `sidebarBullets`.

---

## SEO / AIO / GEO
- **metaTitle:** `{Tytuł} Recipe | Incr-EdibleCupCakes` lub `{Tytuł} | Incr-EdibleCupCakes Guides`, max ~60 znaków.
- **metaDescription:** 120–158 znaków, keyword + korzyść + CTA.
- **shortDescription:** jedno zdanie z czasem prep+bake (snippet).
- Schema: Recipe + FAQPage; guide: Article + HowTo + FAQPage.
- **datePublished** / **dateModified** w JSON.
- Linki wewnętrzne: 2–3 `relatedSlugs` / `relatedLinks` z poprawnymi ścieżkami (`/guides/slug`, `/recipe/slug`).

---

## Unikalność
- Inny kąt niż istniejące treści na stronie.
- Inna struktura akapitów niż poprzedni artykuł w serii.
- FAQ specyficzne — zero generycznego fillera.
- Brak duplikatów tytułów.
- Każdy akapit = nowa informacja (zero paddingu).

---

## Obrazy — spójność wizualna
- Natural light, ciepłe tony, biała porcelana / jasne drewno.
- Bez tekstu, logo, watermarków, rąk w kadrze (chyba że process wymaga).
- Prompty kończą: „same photoshoot style as Incr-EdibleCupCakes food blog”.

---

## Definition of Done (nowa treść)
- [ ] Zero em/en dash w całym JSON (w tym prompt i alt)
- [ ] Zero słów z listy AI-slop
- [ ] Lead sekcji = odpowiedź w 1. zdaniu
- [ ] Max 2 zdania na akapit w guide; opis przepisu = 3–4 krótkie akapity
- [ ] Min. 1 lista tam, gdzie są kroki / porównania / kryteria
- [ ] metaDescription unikalna, z CTA
- [ ] 3 obrazy (hero, process, detail)
- [ ] `npm run content:cleanup` bez warningów
- [ ] Build przechodzi

## SEO sync po publikacji (automatyczne)
Po każdej nowej treści (`content:publish-due`) lub przed deployem:

```bash
npm run update-seo          # sitemap.xml + llms.txt + IndexNow (wszystkie URL)
npm run update-seo -- --ping   # + ping Google/Bing sitemap
```

Skrypt `update-seo.mjs`:
1. **`public/sitemap.xml`** — wszystkie przepisy (legacy + generated), guide'y, kategorie, tagi
2. **`public/llms.txt`** — lista URL dla AI crawlerów (GEO), newest first
3. **`public/{INDEXNOW_KEY}.txt`** — weryfikacja Bing Webmaster IndexNow
4. **IndexNow API** — szybka indeksacja Bing / Yandex

Klucz IndexNow (publiczny): `a48df6c167094534b369300a89f8f530`  
Override: env `INDEXNOW_KEY`

`robots.txt` — Allow dla GPTBot, Google-Extended, PerplexityBot + Sitemap.

