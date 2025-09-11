import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import { validatedRecipes as recipes } from '../data/recipes';

// Define category information
const categoryInfo = {
  classic: {
    name: 'Classic Cupcakes',
    description: 'Timeless recipes that have been perfected over generations. These are the cupcakes that bring back childhood memories and create new ones.',
    color: 'from-blue-500 to-indigo-600',
    icon: '🧁'
  },
  keto: {
    name: 'Keto Cupcakes',
    description: 'Low-carb, high-fat cupcakes that dont compromise on taste. Perfect for maintaining your ketogenic lifestyle while satisfying your sweet tooth.',
    color: 'from-green-500 to-emerald-600',
    icon: '🥑'
  },
  vegan: {
    name: 'Vegan Cupcakes',
    description: 'Plant-based cupcakes that are kind to animals and the environment. Proving that vegan baking can be just as delicious and indulgent.',
    color: 'from-emerald-500 to-teal-600',
    icon: '🌱'
  },
  'nut-free': {
    name: 'Nut-Free Cupcakes',
    description: 'Safe and delicious cupcakes for those with nut allergies. Every recipe is carefully crafted to avoid cross-contamination while maximizing flavor.',
    color: 'from-amber-500 to-orange-600',
    icon: '🚫'
  },
  'gluten-free': {
    name: 'Gluten-Free Cupcakes',
    description: 'Cupcakes made without gluten but full of flavor and texture. Perfect for those with celiac disease or gluten sensitivity.',
    color: 'from-purple-500 to-violet-600',
    icon: '🌾'
  }
};

const CategoriesPage = () => {
  const { categoryId } = useParams<{ categoryId?: string }>();
  const currentCategory = categoryId ? categoryInfo[categoryId as keyof typeof categoryInfo] : null;
  const categoryRecipes = categoryId ? recipes.filter(recipe => recipe.category === categoryId) : [];

  return (
    <div className="pt-16 lg:pt-20">
      <Helmet>
        <title>
          {currentCategory 
            ? `${currentCategory.name} - Incr-EdibleCupCakes` 
            : 'Cupcake Categories - Incr-EdibleCupCakes'}
        </title>
        <meta 
          name="description" 
          content={currentCategory 
            ? `${currentCategory.description} Browse our collection of ${currentCategory.name.toLowerCase()} recipes.`
            : 'Explore our cupcake categories including Classic, Keto, Vegan, Nut-Free, and Gluten-Free options. Find the perfect recipe for your dietary needs.'} 
        />
        <link 
          rel="canonical" 
          href={`https://incr-ediblecupcakes.com/categories${categoryId ? `/${categoryId}` : ''}`} 
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": currentCategory ? currentCategory.name : "Cupcake Categories",
            "description": currentCategory ? currentCategory.description : "Explore our cupcake categories",
            "url": `https://incr-ediblecupcakes.com/categories${categoryId ? `/${categoryId}` : ''}`,
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": Object.entries(categoryInfo).map(([id, info], index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": info.name,
                "description": info.description,
                "url": `https://incr-ediblecupcakes.com/categories/${id}`
              }))
            }
          })}
        </script>
      </Helmet>

      {/* Category Header */}
      {currentCategory ? (
        <div className={`bg-gradient-to-r ${currentCategory.color} p-8 md:p-12 rounded-lg text-white mb-8`}>
          <div className="max-w-6xl mx-auto">
            <Link 
              to="/categories" 
              className="inline-flex items-center text-white hover:text-white/80 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Categories
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center">
              {currentCategory.icon} {currentCategory.name}
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl">
              {currentCategory.description}
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">
            Cupcake Categories
          </h1>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl">
            Explore our diverse collection of cupcake recipes, carefully crafted for different dietary needs and preferences.
          </p>
        </div>
      )}

      {/* Category Grid or Recipe List */}
      <div className="max-w-6xl mx-auto px-4">
        {currentCategory ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(categoryInfo).map(([id, info]) => (
              <Link 
                key={id}
                to={`/categories/${id}`}
                className={`bg-gradient-to-r ${info.color} p-8 rounded-lg text-white transform hover:scale-105 transition-transform`}
              >
                <div className="text-4xl mb-4">{info.icon}</div>
                <h2 className="text-2xl font-bold mb-2">{info.name}</h2>
                <p className="opacity-90">{info.description}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
