import { Heart, Clock, Users, Star } from 'lucide-react';

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  image: string;
  category: 'classic' | 'keto' | 'vegan' | 'nut-free' | 'gluten-free';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: number;
  rating: number;
  featured?: boolean;
}

interface RecipeCardProps {
  recipe: Recipe;
}

const getCategoryColor = (category: string) => {
  const colors = {
    classic: 'bg-blue-100 text-blue-800',
    keto: 'bg-green-100 text-green-800',
    vegan: 'bg-emerald-100 text-emerald-800',
    'nut-free': 'bg-amber-100 text-amber-800',
    'gluten-free': 'bg-purple-100 text-purple-800',
  };
  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <article className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-cupcake-pink/30">
      <div className="relative overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {recipe.featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-sunshine-400 to-sunshine-600 text-white px-3 py-1 rounded-full text-xs font-bold font-quicksand shadow-lg">
            ⭐ Featured
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
          <Heart className="w-5 h-5 text-cupcake-coral hover:fill-cupcake-coral transition-colors duration-300 cursor-pointer" />
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold font-quicksand ${getCategoryColor(recipe.category)}`}>
            {recipe.category.replace('-', ' ').toUpperCase()}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-sunshine-400 fill-sunshine-400" />
            <span className="text-sm font-medium text-gray-700">{recipe.rating}</span>
          </div>
        </div>

        <h3 className="text-xl font-poppins font-bold text-gray-900 mb-2 group-hover:text-cupcake-coral transition-colors duration-300">
          {recipe.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 font-quicksand line-clamp-2">
          {recipe.shortDescription}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 font-quicksand mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.totalTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings} servings</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
            recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {recipe.difficulty}
          </span>
        </div>

        <a
          href={`/recipe/${recipe.slug}`}
          className="block w-full bg-gradient-to-r from-cupcake-coral to-cupcake-cherry text-white text-center py-3 rounded-xl font-quicksand font-semibold hover:from-cupcake-cherry hover:to-cupcake-coral transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          View Recipe
        </a>
      </div>
    </article>
  );
}