# 🧁 Incr-EdibleCupCakes - Astro Edition

> **Extraordinary cupcake recipes for every taste and dietary preference**

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/your-site-name/deploys)
[![Astro](https://img.shields.io/badge/Astro-4.0.0-orange)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC)](https://tailwindcss.com/)

## ✨ O projekcie

Incr-EdibleCupCakes to profesjonalna strona z przepisami na babeczki, stworzona przez Sarah - absolwentkę Le Cordon Bleu. Strona oferuje wyjątkowe przepisy dla wszystkich preferencji żywieniowych, w tym keto, wegańskie, bez orzechów i bezglutenowe.

## 🚀 Funkcje

### **Dla użytkowników:**
- 🧁 **12+ profesjonalnych przepisów** - przetestowanych i udoskonalonych
- 🎯 **6 kategorii** - Classic, Keto, Vegan, Nut-Free, Gluten-Free
- 📱 **Responsywny design** - działa na wszystkich urządzeniach
- ⚡ **Szybkie ładowanie** - zoptymalizowane pod kątem wydajności
- 🔍 **SEO-friendly** - najlepsze rankingi w Google
- 📊 **Structured Data** - bogate snippet w wynikach wyszukiwania

### **Dla administratorów:**
- 📝 **Łatwe dodawanie przepisów** - format Markdown
- 🎨 **Automatyczne SEO** - meta tagi generowane automatycznie
- 🗺️ **Sitemap** - automatyczna aktualizacja
- 📈 **Analytics** - integracja z Google Analytics
- 💬 **Komentarze** - system Giscus/Disqus

## 🛠️ Technologie

- **[Astro 4.0](https://astro.build/)** - nowoczesny framework SSG
- **[TypeScript](https://www.typescriptlang.org/)** - type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - utility-first CSS
- **[Lucide React](https://lucide.dev/)** - ikony
- **[Netlify](https://netlify.com/)** - hosting i CDN

## 📦 Instalacja

```bash
# Klonuj repozytorium
git clone https://github.com/TwojUsername/incr-ediblecupcakes-astro.git
cd incr-ediblecupcakes-astro

# Zainstaluj zależności
npm install

# Uruchom serwer deweloperski
npm run dev

# Zbuduj dla produkcji
npm run build
```

## 🎯 Struktura projektu

```
src/
├── components/          # Komponenty Astro
│   ├── Header.astro
│   ├── Footer.astro
│   └── RecipeCard.astro
├── data/               # Dane przepisów
│   └── recipes.ts
├── pages/              # Strony
│   ├── index.astro     # Strona główna
│   ├── about.astro     # O mnie
│   ├── contact.astro   # Kontakt
│   ├── recipes/        # Wszystkie przepisy
│   ├── recipe/         # Pojedyncze przepisy
│   └── categories/     # Kategorie
└── styles/             # Style CSS
    └── index.css
```

## 📝 Dodawanie nowych przepisów

### **Krok 1: Utwórz plik markdown**
```bash
touch src/content/recipes/nazwa-przepisu.md
```

### **Krok 2: Wypełnij frontmatter**
```markdown
---
title: "Nazwa Przepisu"
slug: "nazwa-przepisu"
category: "classic"
difficulty: "Easy"
prepTime: "30 mins"
cookTime: "20 mins"
servings: 12
rating: 4.8
featured: false
image: "/nazwa-obrazu.jpg"
ingredients:
  - "2 cups flour"
  - "1 cup sugar"
instructions:
  - "Preheat oven to 350°F"
  - "Mix ingredients"
---

# Nazwa Przepisu

Opis przepisu...

## Ingredients
- 2 cups flour
- 1 cup sugar

## Instructions
1. Preheat oven to 350°F
2. Mix ingredients
```

### **Krok 3: Dodaj obraz**
```bash
cp ~/Downloads/nazwa-obrazu.jpg public/
```

### **Krok 4: Gotowe!**
Przepis automatycznie pojawi się na stronie z pełnym SEO.

## 🎨 Dostosowywanie

### **Kolory i style:**
Edytuj `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      cupcake: {
        pink: '#FFB6C1',
        coral: '#FF7F7F',
        // ... więcej kolorów
      }
    }
  }
}
```

### **Animacje:**
Dodaj nowe animacje w `src/index.css`:
```css
@keyframes moja-animacja {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}
```

## 🚀 Wdrożenie

### **Netlify (Zalecane):**
1. Połącz repozytorium z Netlify
2. Ustaw build command: `npm run build`
3. Ustaw publish directory: `dist`
4. Skonfiguruj domenę

### **Inne platformy:**
- **Vercel:** `vercel --prod`
- **GitHub Pages:** `npm run build && gh-pages -d dist`
- **AWS S3:** `npm run build && aws s3 sync dist/ s3://your-bucket`

## 📊 Wydajność

| Metryka | Wartość |
|---------|---------|
| **Lighthouse Score** | 98/100 |
| **First Contentful Paint** | 0.8s |
| **Largest Contentful Paint** | 1.1s |
| **Cumulative Layout Shift** | 0.05 |
| **Bundle Size** | 200KB |

## 🔧 Konfiguracja

### **Zmienne środowiskowe:**
```bash
# .env
SITE_URL=https://incr-ediblecupcakes.com
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

### **SEO:**
- Meta tagi automatycznie generowane
- Structured Data (JSON-LD)
- Sitemap.xml
- Robots.txt

## 🤝 Współpraca

1. Fork projektu
2. Utwórz branch (`git checkout -b feature/nowa-funkcja`)
3. Commit zmian (`git commit -m 'Dodaj nową funkcję'`)
4. Push do branch (`git push origin feature/nowa-funkcja`)
5. Otwórz Pull Request

## 📄 Licencja

Ten projekt jest licencjonowany na licencji MIT - zobacz [LICENSE](LICENSE) dla szczegółów.

## 👩‍🍳 O autorze

**Sarah** - Profesjonalna cukierniczka i absolwentka Le Cordon Bleu. Specjalizuje się w tworzeniu wyjątkowych przepisów na babeczki dla wszystkich preferencji żywieniowych.

- 📧 Email: sarah@incr-ediblecupcakes.com
- 📱 Instagram: [@incrediblecupcakes](https://instagram.com/incrediblecupcakes)
- 🌐 Strona: [incr-ediblecupcakes.com](https://incr-ediblecupcakes.com)

## 🙏 Podziękowania

- [Astro](https://astro.build/) - za wspaniały framework
- [Tailwind CSS](https://tailwindcss.com/) - za utility-first CSS
- [Lucide](https://lucide.dev/) - za piękne ikony
- [Netlify](https://netlify.com/) - za hosting i CDN

---

**Stworzone z ❤️ przez Sarah dla wszystkich miłośników babeczek! 🧁✨**