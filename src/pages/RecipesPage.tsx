import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, Filter, Star, Heart, ChefHat } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import ClientOnly from '../components/ClientOnly';
import { validatedRecipes as recipes } from '../data/recipes';

const RecipesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Zmienne wykorzystywane w komponencie

  const categories = [
    { id: 'all', name: 'All Recipes', count: recipes.length },
    { id: 'classic', name: 'Classic', count: recipes.filter(r => r.category === 'classic').length },
    { id: 'keto', name: 'Keto', count: recipes.filter(r => r.category === 'keto').length },
    { id: 'vegan', name: 'Vegan', count: recipes.filter(r => r.category === 'vegan').length },
    { id: 'nut-free', name: 'Nut-Free', count: recipes.filter(r => r.category === 'nut-free').length },
    { id: 'gluten-free', name: 'Gluten-Free', count: recipes.filter(r => r.category === 'gluten-free').length },
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'Easy', name: 'Easy' },
    { id: 'Medium', name: 'Medium' },
    { id: 'Hard', name: 'Hard' },
  ];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="pt-16 lg:pt-20">
            <Helmet>
        <title>Complete Cupcake Recipe Collection - All Dietary Options | Incr-EdibleCupCakes</title>
        <meta name="description" content={`Browse our complete collection of ${recipes.length}+ extraordinary cupcake recipes including keto, vegan, nut-free, gluten-free, and classic options. Professional tested recipes with step-by-step instructions and beautiful photos.`} />
        <meta name="keywords" content="cupcake recipes collection, keto cupcakes, vegan cupcakes, nut-free baking, gluten-free desserts, homemade cupcakes, professional baker recipes, dietary cupcakes, allergen-free baking" />
        <link rel="canonical" href="https://incr-ediblecupcakes.com/recipes" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Complete Cupcake Recipe Collection | Incr-EdibleCupCakes" />
        <meta property="og:description" content={`Browse ${recipes.length}+ professional cupcake recipes for all dietary preferences`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://incr-ediblecupcakes.com/recipes" />
        <meta property="og:image" content="https://incr-ediblecupcakes.com/A%20vibrant%2C%20mouth-watering%20cupcake%20scene.png" />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Complete Cupcake Recipe Collection | Incr-EdibleCupCakes" />
        <meta name="twitter:description" content={`Browse ${recipes.length}+ professional cupcake recipes for all dietary preferences`} />
        <meta name="twitter:image" content="https://incr-ediblecupcakes.com/A%20vibrant%2C%20mouth-watering%20cupcake%20scene.png" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Complete Cupcake Recipe Collection",
            "description": `Browse ${recipes.length}+ professional cupcake recipes for all dietary preferences`,
            "url": "https://incr-ediblecupcakes.com/recipes",
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": filteredRecipes.length,
              "itemListElement": filteredRecipes.map((recipe, index) => ({
                "@type": "Recipe",
                "position": index + 1,
                "name": recipe.title,
                "url": `https://incr-ediblecupcakes.com/recipe/${recipe.slug}`,
                "image": `https://incr-ediblecupcakes.com${recipe.image}`,
                "description": recipe.shortDescription,
                "recipeCategory": recipe.category,
                "recipeCuisine": recipe.cuisine,
                "difficulty": recipe.difficulty,
                "prepTime": recipe.prepTime.includes('PT') ? recipe.prepTime : `PT${recipe.prepTime.match(/\d+/)?.[0] || '30'}M`,
                "cookTime": recipe.cookTime.includes('PT') ? recipe.cookTime : `PT${recipe.cookTime.match(/\d+/)?.[0] || '30'}M`,
                "totalTime": recipe.totalTime.includes('PT') ? recipe.totalTime : `PT${recipe.totalTime.match(/\d+/)?.[0] || '60'}M`,
                "recipeYield": recipe.servings,
                "recipeIngredient": recipe.ingredients,
                "recipeInstructions": recipe.instructions.map((instruction, stepIndex) => ({
                  "@type": "HowToStep",
                  "position": stepIndex + 1,
                  "text": instruction,
                  "image": `https://incr-ediblecupcakes.com${recipe.image}`
                })),
                "author": recipe.author || {
                  "@type": "Organization",
                  "name": "Incr-EdibleCupCakes",
                  "url": "https://incr-ediblecupcakes.com"
                },
                "keywords": recipe.keywords?.join(', ') || `${recipe.category} cupcakes, ${recipe.difficulty.toLowerCase()} recipes, homemade cupcakes`,
                "nutrition": recipe.nutritionInfo ? {
                  "@type": "NutritionInformation",
                  "calories": `${recipe.nutritionInfo.calories} calories`,
                  "carbohydrateContent": `${recipe.nutritionInfo.carbs}g`,
                  "proteinContent": `${recipe.nutritionInfo.protein}g`,
                  "fatContent": `${recipe.nutritionInfo.fat}g`,
                  "fiberContent": `${recipe.nutritionInfo.fiber}g`,
                  "sugarContent": `${recipe.nutritionInfo.sugar}g`
                } : undefined,
                "video": recipe.video ? {
                  "@type": "VideoObject",
                  "name": `${recipe.title} - Video Tutorial`,
                  "description": `Learn how to make ${recipe.title} with this step-by-step video tutorial`,
                  "thumbnailUrl": `https://incr-ediblecupcakes.com${recipe.image}`,
                  "contentUrl": recipe.video,
                  "embedUrl": recipe.video
                } : undefined,
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": recipe.rating,
                  "reviewCount": Math.floor(recipe.rating * 50) + 50
                },
              }))
            }
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-cupcake-coral via-sunshine-400 to-cupcake-cherry overflow-hidden">
        <div className="absolute inset-0">
          <ClientOnly>
            <>
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-float-random opacity-20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: `${5 + i * 0.3}s`,
                }}
              >
                {i % 4 === 0 ? '🧁' : i % 4 === 1 ? '🍰' : i % 4 === 2 ? '🎂' : '📖'}
              </div>
            ))}
            </>
          </ClientOnly>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-quicksand text-4xl sm:text-6xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
            Recipe <span className="text-sunshine-300 animate-gradient-text">Collection</span>
          </h1>
          <p className="font-nunito text-xl text-pink-100 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
            Explore our complete library of extraordinary cupcake recipes, each crafted with love and tested to perfection. 
            From classic favorites to innovative dietary alternatives.
          </p>
          <div className="flex items-center justify-center space-x-6 text-pink-100">
            <div className="flex items-center space-x-2">
              <ChefHat className="w-6 h-6" />
              <span className="font-quicksand font-bold">{recipes.length}+ Recipes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6" />
              <span className="font-quicksand font-bold">10K+ Favorites</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-6 h-6 fill-current text-sunshine-300" />
              <span className="font-quicksand font-bold">4.9 Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="font-nunito w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cupcake-coral focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="font-nunito px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cupcake-coral focus:border-transparent transition-all duration-300"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="font-nunito px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cupcake-coral focus:border-transparent transition-all duration-300"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.id} value={difficulty.id}>
                    {difficulty.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 text-center">
            <p className="font-nunito text-gray-600">
              Showing <span className="font-bold text-cupcake-coral">{filteredRecipes.length}</span> recipes
              {searchTerm && (
                <span> for "<span className="font-bold">{searchTerm}</span>"</span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Recipe Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRecipes.map((recipe, index) => (
                <div
                  key={recipe.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="font-quicksand text-2xl font-black text-gray-900 mb-4">No recipes found</h3>
              <p className="font-nunito text-gray-600 mb-6">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                }}
                className="font-quicksand px-6 py-3 bg-cupcake-coral text-white rounded-xl hover:bg-cupcake-cherry transition-colors duration-300 font-bold"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-quicksand text-3xl font-black text-gray-900 text-center mb-12">
            Browse by <span className="text-cupcake-coral">Category</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.slice(1).map(category => (
              <Link
                key={category.id}
                to={`/categories/${category.id}`}
                className="group bg-gradient-to-br from-cupcake-pink/20 to-sunshine-100/50 rounded-2xl p-6 text-center hover:from-cupcake-pink/30 hover:to-sunshine-200/60 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-cupcake-coral to-sunshine-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ChefHat className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-quicksand font-bold text-gray-900 mb-2">{category.name}</h3>
                <p className="font-nunito text-sm text-gray-600">{category.count} recipes</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RecipesPage;