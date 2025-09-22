import React from 'react';

interface Recipe {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  category: string;
  difficulty: string;
  prepTime: string;
  servings: number;
  rating: number;
  featured?: boolean;
}

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      classic: 'bg-blue-100 text-blue-800',
      keto: 'bg-green-100 text-green-800',
      vegan: 'bg-emerald-100 text-emerald-800',
      'nut-free': 'bg-amber-100 text-amber-800',
      gluten: 'bg-purple-100 text-purple-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border-2 border-cupcake-pink/20 hover:border-cupcake-coral/40">
      <div className="relative overflow-hidden">
        <picture>
          <source 
            srcSet={`${recipe.image}?w=375&fm=avif&q=75 375w, ${recipe.image}?w=640&fm=avif&q=80 640w, ${recipe.image}?w=960&fm=avif&q=80 960w`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            type="image/avif"
          />
          <source 
            srcSet={`${recipe.image}?w=375&fm=webp&q=80 375w, ${recipe.image}?w=640&fm=webp&q=85 640w, ${recipe.image}?w=960&fm=webp&q=85 960w`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            type="image/webp"
          />
          <img
            src={`${recipe.image}?w=375&fm=jpg&q=85`}
            alt={recipe.title}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
            decoding="async"
            srcSet={`${recipe.image}?w=375&fm=jpg&q=85 375w, ${recipe.image}?w=640&fm=jpg&q=90 640w, ${recipe.image}?w=960&fm=jpg&q=90 960w`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category Badge */}
        <div className={`absolute top-4 left-4 px-4 py-2 rounded-full text-xs font-bold backdrop-blur-sm ${getCategoryColor(recipe.category)} transform transition-all duration-300 group-hover:scale-110`}>
          {recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1)}
        </div>

        {/* Featured Badge */}
        {recipe.featured && (
          <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-sprinkle-yellow to-sprinkle-orange rounded-full flex items-center justify-center animate-pulse-glow shadow-lg">
            <span className="text-lg">⭐</span>
          </div>
        )}

        {/* Favorite Button */}
        <button 
          className="absolute bottom-4 right-4 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-cupcake-coral hover:text-white transform hover:scale-110 shadow-xl"
          aria-label={`Add ${recipe.title} to favorites`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>
      </div>

      <div className="p-8">
        <h3 className="font-quicksand text-xl font-bold text-gray-900 mb-4 group-hover:text-cupcake-coral transition-colors duration-300 line-clamp-2">
          {recipe.title}
        </h3>
        <p className="font-nunito text-gray-600 mb-6 line-clamp-3 leading-relaxed">
          {recipe.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span className="font-medium">{recipe.prepTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
              </svg>
              <span className="font-medium">{recipe.servings}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 bg-sprinkle-yellow/20 px-3 py-1 rounded-full">
            <svg className="w-4 h-4 fill-current text-sprinkle-yellow" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="font-bold text-gray-700">{recipe.rating}</span>
          </div>
        </div>

        <a
          href={`/recipe/${recipe.slug}`}
          className="font-quicksand block w-full py-4 bg-gradient-to-r from-cupcake-coral to-cupcake-cherry text-white text-center font-bold text-lg rounded-2xl hover:from-cupcake-cherry hover:to-cupcake-coral transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          🧁 View Recipe
        </a>
      </div>
    </div>
  );
};

export default RecipeCard;