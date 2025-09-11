import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, Heart } from 'lucide-react';

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
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
        />
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
        <button className="absolute bottom-4 right-4 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-cupcake-coral hover:text-white transform hover:scale-110 shadow-xl">
          <Heart className="w-5 h-5" />
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
              <Clock className="w-4 h-4" />
              <span className="font-medium">{recipe.prepTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span className="font-medium">{recipe.servings}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 bg-sprinkle-yellow/20 px-3 py-1 rounded-full">
            <Star className="w-4 h-4 fill-current text-sprinkle-yellow" />
            <span className="font-bold text-gray-700">{recipe.rating}</span>
          </div>
        </div>

        <Link
          to={`/recipe/${recipe.slug}`}
          className="font-quicksand block w-full py-4 bg-gradient-to-r from-cupcake-coral to-cupcake-cherry text-white text-center font-bold text-lg rounded-2xl hover:from-cupcake-cherry hover:to-cupcake-coral transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          🧁 View Recipe
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard;