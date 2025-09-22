# 📝 Jak dodawać nowe przepisy

## 🚀 Szybki start

### **Krok 1: Utwórz plik markdown**
```bash
# W folderze src/content/recipes/
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
totalTime: "50 mins"
servings: 12
rating: 4.8
featured: false
image: "/nazwa-obrazu.jpg"
ingredients:
  - "2 cups all-purpose flour"
  - "1 cup granulated sugar"
  - "1/2 cup unsalted butter, softened"
  - "2 large eggs"
  - "2 tsp vanilla extract"
  - "2 tsp baking powder"
  - "1/2 tsp salt"
  - "1 cup whole milk"
instructions:
  - "Preheat oven to 350°F (175°C) and line muffin tin with cupcake liners."
  - "Cream butter and sugar until light and fluffy, about 3 minutes."
  - "Add eggs one at a time, then vanilla extract."
  - "In separate bowl, whisk flour, baking powder, and salt."
  - "Alternate adding dry ingredients and milk to wet ingredients."
  - "Fill cupcake liners ¾ full and bake for 18-20 minutes."
  - "Cool completely before frosting."
nutritionInfo:
  calories: 320
  carbs: 45
  protein: 4
  fat: 14
  fiber: 1
  sugar: 38
tips:
  - "Room temperature ingredients mix better"
  - "Don't overmix the batter to keep cupcakes tender"
  - "Use an ice cream scoop for even portions"
variations:
  - "Add lemon zest for a citrus twist"
  - "Swirl in strawberry jam for berry vanilla cupcakes"
  - "Top with fresh berries and whipped cream"
  - "Create funfetti version with colorful sprinkles"
pairings: "These vanilla cupcakes pair beautifully with fresh coffee, Earl Grey tea, or a glass of cold milk."
bestTime: "Perfect for birthday parties, afternoon tea, office celebrations, or any time you want to bring joy to someone's day."
recipeKeys: ["Beginner Friendly", "Party Perfect", "Make Ahead", "Kid Approved", "Classic Comfort"]
dietaryBadges: ["Vegetarian"]
cuisine: "American"
conclusion: "These vanilla dream cupcakes prove that sometimes the classics are classic for a reason."
faq:
  - question: "Why are my vanilla cupcakes dense instead of fluffy?"
    answer: "Dense cupcakes are usually caused by overmixing the batter or using cold ingredients. Make sure all ingredients are at room temperature and mix just until combined."
  - question: "Can I use vanilla extract instead of vanilla beans?"
    answer: "Yes! Use 2 teaspoons of high-quality vanilla extract instead of vanilla beans. While you won't get the beautiful vanilla specks, the flavor will still be excellent."
author:
  name: "Sarah"
  url: "https://incr-ediblecupcakes.com/about"
keywords: ["vanilla cupcakes", "classic cupcakes", "homemade cupcakes", "baking recipes", "dessert recipes"]
---

# Nazwa Przepisu

Opis przepisu w formacie Markdown...

## Ingredients

- 2 cups all-purpose flour
- 1 cup granulated sugar
- 1/2 cup unsalted butter, softened
- 2 large eggs
- 2 tsp vanilla extract
- 2 tsp baking powder
- 1/2 tsp salt
- 1 cup whole milk

## Instructions

### Step 1: Prepare the Oven
Preheat your oven to 350°F (175°C) and line a cupcake pan with paper liners.

### Step 2: Mix Dry Ingredients
In a medium bowl, whisk together flour, baking powder, and salt.

### Step 3: Cream Butter and Sugar
In a large bowl, cream together butter and sugar until light and fluffy...

## Pro Tips

- Use room temperature ingredients for best results
- Don't overmix the batter after adding flour
- Use an ice cream scoop for even portioning
- Let cupcakes cool completely before frosting

## Variations

- Add lemon zest for a citrus twist
- Swirl in strawberry jam for berry vanilla cupcakes
- Top with fresh berries and whipped cream
- Create funfetti version with colorful sprinkles
```

### **Krok 3: Dodaj obraz**
```bash
# Skopiuj obraz do public/
cp ~/Downloads/nazwa-obrazu.jpg public/
```

### **Krok 4: Gotowe!**
Przepis automatycznie pojawi się na stronie z pełnym SEO.

## 📋 Wymagane pola

### **Podstawowe:**
- `title` - nazwa przepisu
- `slug` - URL-friendly nazwa (bez spacji, małe litery)
- `category` - jedna z: `classic`, `keto`, `vegan`, `nut-free`, `gluten-free`
- `difficulty` - jedna z: `Easy`, `Medium`, `Hard`
- `prepTime` - czas przygotowania (np. "30 mins")
- `cookTime` - czas pieczenia (np. "20 mins")
- `totalTime` - całkowity czas (np. "50 mins")
- `servings` - liczba porcji (liczba)
- `rating` - ocena (liczba 1-5)
- `image` - ścieżka do obrazu (np. "/nazwa-obrazu.jpg")
- `ingredients` - lista składników
- `instructions` - lista instrukcji

### **Opcjonalne:**
- `featured` - czy wyróżniony (boolean)
- `nutritionInfo` - informacje żywieniowe
- `tips` - wskazówki
- `variations` - warianty przepisu
- `pairings` - z czym podawać
- `bestTime` - kiedy najlepiej podawać
- `recipeKeys` - kluczowe cechy
- `dietaryBadges` - oznaczenia dietetyczne
- `cuisine` - kuchnia
- `conclusion` - podsumowanie
- `faq` - często zadawane pytania
- `author` - autor
- `keywords` - słowa kluczowe

## 🎨 Kategorie

### **Classic** 🧁
- Tradycyjne przepisy
- Sprawdzone przez pokolenia
- Dla wszystkich

### **Keto** 🥑
- Niskowęglowodanowe
- Wysokotłuszczowe
- Dla diety ketogenicznej

### **Vegan** 🌱
- Bez produktów zwierzęcych
- Roślinne alternatywy
- Dla wegan i wegetarian

### **Nut-Free** 🥜
- Bez orzechów
- Bezpieczne dla alergików
- Dla wszystkich

### **Gluten-Free** 🌾
- Bez glutenu
- Dla celiaków
- Alternatywne mąki

## 📸 Obrazy

### **Wymagania:**
- Format: JPG, PNG, WebP
- Rozmiar: minimum 800x600px
- Jakość: wysoka (minimum 80%)
- Nazwa: bez spacji, małe litery

### **Optymalizacja:**
```bash
# Kompresja obrazu
npx imagemin src/images/*.{jpg,png} --out-dir=public --plugin=imagemin-mozjpeg --plugin=imagemin-pngquant
```

## 🔍 SEO

### **Automatyczne:**
- Meta tagi generowane z frontmatter
- Structured Data (JSON-LD)
- Sitemap aktualizowany
- URL-friendly slug

### **Ręczne:**
- Dodaj słowa kluczowe w `keywords`
- Napisz dobry opis w treści
- Użyj nagłówków H2, H3
- Dodaj alt text do obrazów

## 🚀 Publikacja

### **Lokalnie:**
```bash
npm run dev
# Sprawdź na http://localhost:4321
```

### **Produkcja:**
```bash
npm run build
# Sprawdź folder dist/
```

### **Deploy:**
```bash
git add .
git commit -m "Dodaj nowy przepis: Nazwa Przepisu"
git push origin main
# Netlify automatycznie zbuduje i wdroży
```

## 📊 Statystyki

Po dodaniu przepisu:
- ✅ Automatycznie dodany do sitemap
- ✅ Meta tagi wygenerowane
- ✅ Structured Data utworzone
- ✅ URL dostępny pod `/recipe/slug`
- ✅ Wyświetlany w kategorii
- ✅ Indeksowany przez Google

## 🎯 Wskazówki

### **Dobre praktyki:**
- Używaj opisowych nazw plików
- Sprawdzaj składnię Markdown
- Testuj lokalnie przed publikacją
- Używaj wysokiej jakości obrazów
- Pisz szczegółowe instrukcje

### **Częste błędy:**
- Błędny format frontmatter
- Brakujące wymagane pola
- Obrazy w złym formacie
- Błędne slug (spacje, duże litery)
- Brakujące pliki obrazów

## 🆘 Wsparcie

Jeśli masz problemy:
1. Sprawdź składnię Markdown
2. Zweryfikuj frontmatter
3. Sprawdź czy obraz istnieje
4. Uruchom `npm run build` lokalnie
5. Skontaktuj się z Sarah

**Powodzenia z nowym przepisem! 🧁✨**
