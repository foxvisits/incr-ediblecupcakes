# Pipeline treści — Incr-EdibleCupCakes

**Najprościej: wklej pomysły w czacie Cursora** — agent dopisze je do `ideas.txt` i uruchomi `npm run content:run`. Nie musisz otwierać plików ani JSON.

Alternatywnie: edytuj **`content/ideas.txt`** (jeden przepis na linię).

---

## Szybki start (zero ręcznej weryfikacji)

### 1. Klucze API (`.env` lub `.env.local`)

```env
ANTHROPIC_API_KEY=sk-ant-...
KIE_API_KEY=...
FAL_KEY=...   # opcjonalny zapas obrazów
```

### 2. Wymagania jakości (ustaw raz)

**`content/requirements.md`** — styl, unikalność, SEO, schema, **2–3 obrazy** na przepis/guide.

### 3. Harmonogram (ustaw raz)

**`content/config.json`** — ile dziennie, okno godzin, `imagesPerRecipe: 3`.

### 4. Jedna komenda (lub poproś agenta w czacie)

```bash
npm run content:run
```

---

## Wklejanie w czacie (zalecane)

Napisz np.:

> Oto 60 przepisów: [lista]. Uruchom pipeline.

Agent dopisze linie, uruchomi pipeline i podsumuje wynik.

Format listy dowolny — bullet, numeracja, plain text. Opcjonalnie: `Tytuł | kategoria | notatki`.

**Guide'y:** wklej z dopiskiem „to guide'y” → `content/guide-ideas.txt` (pełny auto-pipeline — wkrótce).

---

## Obrazy (3 na przepis)

| # | Rola | Plik |
|---|------|------|
| 1 | Hero | `{slug}.jpg` |
| 2 | Proces | `{slug}-2.jpg` |
| 3 | Detal | `{slug}-3.jpg` |

Galeria na stronie + wszystkie URL w schema Recipe JSON-LD.

---

## Gdzie jest „CMS”?

Nie ma panelu www. **Cursor + folder `content/` + komendy npm.**

---

## Komendy

```bash
npm run content:run [-- N]
npm run content:status
```

GitHub Secrets: `ANTHROPIC_API_KEY`, `KIE_API_KEY`, opcjonalnie `FAL_KEY`.
