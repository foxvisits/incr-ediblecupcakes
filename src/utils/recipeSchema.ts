import type { Recipe } from '../data/recipes';

export function buildRecipeKeywords(recipe: Recipe): string {
  const parts = [
    ...(recipe.recipeKeys ?? []),
    ...(recipe.keywords ?? []),
    recipe.category,
    `${recipe.difficulty} difficulty`,
  ].filter(Boolean);
  return [...new Set(parts)].join(', ');
}
