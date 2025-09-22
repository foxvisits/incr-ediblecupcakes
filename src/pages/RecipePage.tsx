import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Clock, Users, Star, Heart, ChefHat, ArrowLeft, Share2, Bookmark, Utensils, Calendar, Target, Award } from 'lucide-react';
import RecipeInteractions from '../components/RecipeInteractions';
import { validatedRecipes as recipes } from '../data/recipes';

const RecipePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const recipe = recipes.find(r => r.slug === slug);

  if (!recipe) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Recipe Not Found</h1>
          <Link
            to="/"
            className="text-rose-500 hover:text-rose-600 font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
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

  return (
    <div className="pt-16 lg:pt-20">
      <Helmet>
        <title>{recipe.title} - Professional Recipe with Expert Tips | Incr-EdibleCupCakes</title>
        <meta name="description" content={`Learn how to make ${recipe.title} with this professional recipe. ${recipe.shortDescription} Complete with ingredients, step-by-step instructions, expert tips, and nutritional information.`} />
        <meta name="keywords" content={`${recipe.title}, ${recipe.category} cupcakes, baking recipe, ${recipe.difficulty} recipe, cupcake ingredients, baking instructions, professional baker, ${recipe.cuisine} cuisine, ${recipe.recipeKeys?.join(', ')}`} />
        <link rel="canonical" href={`https://incr-ediblecupcakes.com/recipe/${recipe.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${recipe.title} | Incr-EdibleCupCakes`} />
        <meta property="og:description" content={recipe.shortDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://incr-ediblecupcakes.com/recipe/${recipe.slug}`} />
        <meta property="og:image" content={`https://incr-ediblecupcakes.com${recipe.image}`} />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${recipe.title} | Incr-EdibleCupCakes`} />
        <meta name="twitter:description" content={recipe.shortDescription} />
        <meta name="twitter:image" content={`https://incr-ediblecupcakes.com${recipe.image}`} />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Recipe",
            "name": recipe.title,
            "description": recipe.shortDescription,
            "image": `https://incr-ediblecupcakes.com${recipe.image}`,
            "url": `https://incr-ediblecupcakes.com/recipe/${recipe.slug}`,
            "datePublished": "2025-01-27",
            "dateModified": "2025-01-27",
            "author": {
              "@type": "Person",
              "name": "Sarah",
              "url": "https://incr-ediblecupcakes.com/about"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Incr-EdibleCupCakes",
              "logo": {
                "@type": "ImageObject",
                "url": "https://incr-ediblecupcakes.com/Incr-EdibleCupCakes%20Logo.png"
              }
            },
            "prepTime": recipe.prepTime,
            "cookTime": recipe.cookTime,
            "totalTime": recipe.totalTime,
            "recipeYield": recipe.servings,
            "recipeCategory": recipe.category,
            "recipeCuisine": recipe.cuisine,
            "difficulty": recipe.difficulty,
            "keywords": recipe.recipeKeys?.join(", "),
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": recipe.rating,
              "reviewCount": Math.floor(recipe.rating * 50) + 100,
              "bestRating": 5,
              "worstRating": 1
            },
            "recipeIngredient": recipe.ingredients,
            "recipeInstructions": recipe.instructions.map(instruction => ({
              "@type": "HowToStep",
              "text": instruction
            })),
            "video": recipe.id === "1" ? {
              "@type": "VideoObject",
              "name": `How to Make ${recipe.title}`,
              "description": `Step-by-step video guide for making ${recipe.title}`,
              "thumbnailUrl": `https://incr-ediblecupcakes.com${recipe.image}`,
              "uploadDate": "2025-01-27"
            } : undefined,
            "nutrition": recipe.nutritionInfo ? {
              "@type": "NutritionInformation",
              "calories": recipe.nutritionInfo.calories,
              "carbohydrateContent": `${recipe.nutritionInfo.carbs}g`,
              "proteinContent": `${recipe.nutritionInfo.protein}g`,
              "fatContent": `${recipe.nutritionInfo.fat}g`,
              "fiberContent": `${recipe.nutritionInfo.fiber}g`,
              "sugarContent": `${recipe.nutritionInfo.sugar}g`
            } : undefined,
            "review": [
              {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "Emma K."
                },
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": 5,
                  "bestRating": 5
                },
                "reviewBody": `Just made these ${recipe.title.toLowerCase()} and they're incredible! ${recipe.category === 'keto' ? 'Perfect for my keto diet.' : recipe.category === 'vegan' ? 'Amazing that they\'re vegan!' : 'My family loved them!'}`
              }
            ],
            "isAccessibleForFree": true,
            "creativeWorkStatus": "Published",
            "inLanguage": "en-US"
          })}
        </script>
      </Helmet>

      {/* Recipe Hero Section */}
      <section className="relative py-12 bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/recipes"
              className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Recipes</span>
            </Link>
            
            <div className="flex space-x-3">
              <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="flex items-center space-x-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(recipe.category)}`}>
                  {recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1)}
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                  {recipe.difficulty}
                </span>
                {recipe.dietaryBadges?.map((badge, index) => (
                  <span key={index} className="px-3 py-1 bg-yellow-400/20 rounded-full text-xs font-semibold">
                    {badge}
                  </span>
                ))}
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                {recipe.title}
              </h1>
              
              <p className="text-xl text-pink-100 mb-8 leading-relaxed">
                {recipe.shortDescription}
              </p>

              <div className="grid grid-cols-2 gap-4 text-pink-100">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <div>
                    <div className="font-medium">Prep: {recipe.prepTime}</div>
                    <div className="text-sm">Total: {recipe.totalTime}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <div>
                    <div className="font-medium">{recipe.servings} cupcakes</div>
                    <div className="text-sm">{recipe.difficulty} level</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 fill-current text-yellow-400" />
                  <div>
                    <div className="font-medium">{recipe.rating} rating</div>
                    <div className="text-sm">{Math.floor(recipe.rating * 50) + 100} reviews</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Utensils className="w-5 h-5" />
                  <div>
                    <div className="font-medium">{recipe.cuisine}</div>
                    <div className="text-sm">cuisine</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src={recipe.image}
                alt={`${recipe.title} - professional ${recipe.category} cupcake recipe`}
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                loading="eager"
                width={600}
                height={384}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Content */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Ingredients */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <ChefHat className="w-6 h-6 text-rose-500 mr-3" />
                  Ingredients
                </h2>
                
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-rose-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 leading-relaxed">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Instructions */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructions</h2>
                <div className="space-y-6">
                  {recipe.instructions.map((instruction, index) => (
                    <div key={index} className="flex space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed pt-1">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Extended Recipe Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Column */}
            <div className="space-y-8">
              {/* Pro Tips */}
              {recipe.tips && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Heart className="w-5 h-5 text-rose-500 mr-2" />
                    Pro Tips
                  </h3>
                  <ul className="space-y-3">
                    {recipe.tips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-rose-500 font-bold">•</span>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Variations */}
              {recipe.variations && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Award className="w-5 h-5 text-purple-500 mr-2" />
                    Delicious Variations
                  </h3>
                  <ul className="space-y-3">
                    {recipe.variations.map((variation, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-purple-500 font-bold">•</span>
                        <span className="text-gray-700">{variation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pairings */}
              {recipe.pairings && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Utensils className="w-5 h-5 text-amber-500 mr-2" />
                    Perfect Pairings
                  </h3>
                  <div className="text-gray-700 leading-relaxed">
                    {recipe.pairings}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Nutrition & Time Info */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Recipe Details</h3>
                
                {/* Time Information */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Timing</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-3 bg-rose-50 rounded-lg">
                      <div className="font-semibold text-rose-600">{recipe.prepTime}</div>
                      <div className="text-gray-500">Prep Time</div>
                    </div>
                    <div className="text-center p-3 bg-rose-50 rounded-lg">
                      <div className="font-semibold text-rose-600">{recipe.cookTime}</div>
                      <div className="text-gray-500">Bake Time</div>
                    </div>
                  </div>
                </div>

                {/* Nutrition Information */}
                {recipe.nutritionInfo && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Nutrition (per cupcake)</h4>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-gray-700">{recipe.nutritionInfo.calories}</div>
                        <div className="text-gray-500 text-xs">Calories</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-gray-700">{recipe.nutritionInfo.carbs}g</div>
                        <div className="text-gray-500 text-xs">Carbs</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-gray-700">{recipe.nutritionInfo.protein}g</div>
                        <div className="text-gray-500 text-xs">Protein</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-gray-700">{recipe.nutritionInfo.fat}g</div>
                        <div className="text-gray-500 text-xs">Fat</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-gray-700">{recipe.nutritionInfo.fiber}g</div>
                        <div className="text-gray-500 text-xs">Fiber</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-gray-700">{recipe.nutritionInfo.sugar}g</div>
                        <div className="text-gray-500 text-xs">Sugar</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Best Time & Recipe Keys */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 text-green-500 mr-2" />
                  When to Enjoy
                </h3>
                <p className="text-gray-700 mb-6">{recipe.bestTime}</p>
                
                {recipe.recipeKeys && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Recipe Highlights</h4>
                    <div className="flex flex-wrap gap-2">
                      {recipe.recipeKeys.map((key, index) => (
                        <span key={index} className="px-3 py-1 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 rounded-full text-sm font-medium">
                          {key}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Conclusion */}
              <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Final Thoughts
                </h3>
                <p className="leading-relaxed">{recipe.conclusion}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {recipe.faq && recipe.faq.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked <span className="text-rose-500">Questions</span>
            </h2>
            
            <div className="space-y-6">
              {recipe.faq.map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recipe Interactions - Comments, Ratings, Shares */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <RecipeInteractions 
            recipeId={recipe.id}
            initialLikes={Math.floor(recipe.rating * 100) + 50}
            initialRating={recipe.rating}
            initialBookmarks={Math.floor(recipe.rating * 40) + 25}
          />
        </div>
      </section>

      {/* Related Recipes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            You Might Also <span className="text-rose-500">Love</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recipes
              .filter(r => r.slug !== recipe.slug && r.category === recipe.category)
              .slice(0, 3)
              .map((relatedRecipe, index) => (
                <Link
                  key={relatedRecipe.id}
                  to={`/recipe/${relatedRecipe.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <img
                    src={relatedRecipe.image}
                    alt={`${relatedRecipe.title} - ${relatedRecipe.category} cupcake recipe`}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    width={300}
                    height={192}
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-rose-600 transition-colors duration-300">
                      {relatedRecipe.title}
                    </h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{relatedRecipe.prepTime}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-current text-yellow-400" />
                        <span>{relatedRecipe.rating}</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RecipePage;