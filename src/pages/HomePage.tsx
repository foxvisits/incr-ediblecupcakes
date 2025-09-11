import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Star, Clock, Users, ChefHat, Heart, Filter } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import ClientOnly from '../components/ClientOnly';
import { validatedRecipes as recipes } from '../data/recipes';

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Recipes', count: recipes.length },
    { id: 'classic', name: 'Classic', count: recipes.filter(r => r.category === 'classic').length },
    { id: 'keto', name: 'Keto', count: recipes.filter(r => r.category === 'keto').length },
    { id: 'vegan', name: 'Vegan', count: recipes.filter(r => r.category === 'vegan').length },
    { id: 'nut-free', name: 'Nut-Free', count: recipes.filter(r => r.category === 'nut-free').length },
  ];

  const filteredRecipes = selectedCategory === 'all' 
    ? recipes 
    : recipes.filter(recipe => recipe.category === selectedCategory);

  const featuredRecipes = recipes.filter(recipe => recipe.featured).slice(0, 3);

  return (
    <div className="pt-16 lg:pt-20">
      <Helmet>
        <title>Incr-EdibleCupCakes - Extraordinary Cupcake Recipes for Every Taste</title>
        <meta name="description" content="Discover unique and innovative cupcake recipes including keto, vegan, nut-free, and classic options. Professional baker Sarah shares tested recipes with step-by-step instructions." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Incr-EdibleCupCakes",
            "url": "https://incr-ediblecupcakes.com",
            "description": "Discover unique and innovative cupcake recipes for every taste and dietary preference",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://incr-ediblecupcakes.com/recipes?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
        <meta name="keywords" content="cupcake recipes, keto cupcakes, vegan cupcakes, nut-free baking, gluten-free desserts, homemade cupcakes, professional baker, dietary cupcakes" />
        <link rel="canonical" href="https://incr-ediblecupcakes.com/" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Incr-EdibleCupCakes - Extraordinary Cupcake Recipes" />
        <meta property="og:description" content="Discover unique and innovative cupcake recipes for every taste and dietary preference." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://incr-ediblecupcakes.com/" />
        <meta property="og:image" content="https://incr-ediblecupcakes.com/A%20vibrant%2C%20mouth-watering%20cupcake%20scene.png" />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Incr-EdibleCupCakes - Extraordinary Cupcake Recipes" />
        <meta name="twitter:description" content="Discover unique and innovative cupcake recipes for every taste and dietary preference." />
        <meta name="twitter:image" content="https://incr-ediblecupcakes.com/A%20vibrant%2C%20mouth-watering%20cupcake%20scene.png" />
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Incr-EdibleCupCakes",
            "url": "https://incr-ediblecupcakes.com",
            "description": "Discover unique and innovative cupcake recipes including keto, vegan, nut-free options and more.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://incr-ediblecupcakes.com/recipes?search={search_term_string}",
              "query-input": "required name=search_term_string"
            },
            "author": {
              "@type": "Person",
              "name": "Sarah",
              "description": "Professional baker and cupcake recipe developer",
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
            "sameAs": [
              "https://instagram.com/incrediblecupcakes",
              "https://facebook.com/incrediblecupcakes"
            ]
          })}
        </script>
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Incr-EdibleCupCakes",
            "url": "https://incr-ediblecupcakes.com",
            "logo": "https://incr-ediblecupcakes.com/Incr-EdibleCupCakes%20Logo.png",
            "description": "Professional bakery specializing in innovative cupcake recipes for all dietary preferences",
            "founder": {
              "@type": "Person",
              "name": "Sarah"
            },
            "sameAs": [
              "https://instagram.com/incrediblecupcakes",
              "https://facebook.com/incrediblecupcakes"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-555-123-CAKE",
              "contactType": "customer service",
              "email": "sarah@incr-ediblecupcakes.com"
            }
          })}
        </script>
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Cupcake Recipe Collection",
            "description": "Complete collection of extraordinary cupcake recipes for all dietary preferences",
            "url": "https://incr-ediblecupcakes.com",
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": recipes.length,
              "itemListElement": recipes.map((recipe, index) => ({
                "@type": "Recipe",
                "position": index + 1,
                "name": recipe.title,
                "url": `https://incr-ediblecupcakes.com/recipe/${recipe.slug}`,
                "image": recipe.image,
                "description": recipe.shortDescription
              }))
            }
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-cupcake-pink via-cupcake-coral to-cupcake-peach">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-white/5" />
        </div>
        
        {/* Cupcake & Sprinkle Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <ClientOnly>
            <>
            {/* Floating Sprinkles */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`absolute animate-sprinkle-fall ${
                  i % 5 === 0 ? 'bg-sprinkle-yellow' : 
                  i % 5 === 1 ? 'bg-sprinkle-blue' : 
                  i % 5 === 2 ? 'bg-sprinkle-green' :
                  i % 5 === 3 ? 'bg-sprinkle-purple' : 'bg-sprinkle-orange'
                } ${i % 3 === 0 ? 'rounded-full' : 'rounded-lg rotate-45'}`}
                style={{
                  width: `${Math.random() * 12 + 4}px`,
                  height: `${Math.random() * 12 + 4}px`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${8 + Math.random() * 4}s`,
                }}
              />
            ))}
            
            {/* Cupcake Icons */}
            <div className="absolute top-20 left-10 text-6xl animate-cupcake-bounce" style={{ animationDelay: '0s' }}>🧁</div>
            <div className="absolute bottom-32 right-20 text-4xl animate-cupcake-bounce" style={{ animationDelay: '1s' }}>🧁</div>
            <div className="absolute top-1/3 right-10 text-5xl animate-cupcake-bounce" style={{ animationDelay: '2s' }}>🧁</div>
            <div className="absolute bottom-1/4 left-1/4 text-3xl animate-cupcake-bounce" style={{ animationDelay: '1.5s' }}>🧁</div>
            
            {/* Icing Swirls */}
            <div className="absolute top-1/4 left-1/3 w-16 h-16 bg-white/20 rounded-full animate-icing-swirl" />
            <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-sprinkle-yellow/30 rounded-full animate-icing-swirl" style={{ animationDelay: '2s' }} />
            </>
          </ClientOnly>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            
            {/* Left Column - Hero Text */}
            <div className="text-center lg:text-left animate-fade-in-up-delayed">
              <h1 className="font-quicksand text-6xl sm:text-7xl lg:text-8xl font-black mb-8 leading-tight">
                <span className="text-white drop-shadow-2xl">Incr-</span>
                <span className="gradient-text text-sprinkle-yellow drop-shadow-2xl">Edible</span>
                <br />
                <span className="cupcake-text drop-shadow-2xl">CupCakes</span>
              </h1>
              
              <p className="font-nunito text-xl sm:text-2xl text-white/95 mb-12 leading-relaxed drop-shadow-lg font-medium max-w-2xl mx-auto lg:mx-0">
                🧁 Discover <strong>extraordinary cupcake recipes</strong> that bring joy to every bite! From classic comfort to innovative dietary alternatives.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <a
                  href="#recipes"
                  className="font-quicksand px-10 py-5 bg-gradient-to-r from-sprinkle-yellow to-sprinkle-orange text-white font-bold text-xl rounded-full hover:from-sprinkle-orange hover:to-cupcake-coral transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl border-4 border-white/20"
                >
                  🍰 Explore Recipes
                </a>
                <Link
                  to="/about"
                  className="font-quicksand px-10 py-5 border-4 border-white text-white font-bold text-xl rounded-full hover:bg-white hover:text-cupcake-coral transition-all duration-300 transform hover:scale-105 backdrop-blur-sm shadow-xl"
                >
                  👩‍🍳 My Story
                </Link>
              </div>
            </div>

            {/* Right Column - Cupcake Showcase */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="relative">
                {/* Main Cupcake Image */}
                <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                  <img
                    src="/A vibrant, mouth-watering cupcake scene.png"
                    alt="Delicious cupcakes showcase"
                    className="w-full h-80 object-cover rounded-2xl shadow-xl"
                  />
                  
                  {/* Floating Recipe Cards */}
                  <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-4 shadow-xl animate-float" style={{ animationDelay: '1s' }}>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">🧁</span>
                      <div>
                        <div className="font-bold text-cupcake-coral text-sm">Classic Vanilla</div>
                        <div className="text-xs text-gray-600">⭐ 4.9 rating</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl animate-float" style={{ animationDelay: '2s' }}>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">🍫</span>
                      <div>
                        <div className="font-bold text-cupcake-coral text-sm">Keto Chocolate</div>
                        <div className="text-xs text-gray-600">⏱️ 30 mins</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute top-1/2 -left-6 bg-white rounded-2xl p-3 shadow-xl animate-float" style={{ animationDelay: '0.5s' }}>
                    <div className="text-center">
                      <span className="text-xl">🌈</span>
                      <div className="font-bold text-cupcake-coral text-xs">Vegan</div>
                    </div>
                  </div>
                </div>
                
                {/* Background Decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-sprinkle-yellow/20 rounded-3xl transform rotate-3 scale-105 -z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-sprinkle-blue/20 to-cupcake-pink/20 rounded-3xl transform -rotate-2 scale-110 -z-20" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
          <div className="w-8 h-12 border-2 border-white/60 rounded-full flex justify-center backdrop-blur-sm">
            <div className="w-1.5 h-4 bg-white/80 rounded-full mt-2 animate-pulse-fast" />
          </div>
          <p className="text-white/80 text-sm mt-2 font-medium drop-shadow-md text-center">Scroll for recipes</p>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="py-32 bg-gradient-to-br from-cupcake-cream to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-quicksand text-5xl font-black text-gray-900 mb-6">
              Featured <span className="text-cupcake-coral">Creations</span> 🌟
            </h2>
            <p className="font-nunito text-xl text-gray-700 max-w-2xl mx-auto font-medium">
              Handpicked recipes that showcase the perfect blend of innovation and deliciousness
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredRecipes.map((recipe, index) => (
              <div
                key={recipe.id}
                className="transform transition-all duration-500 hover:scale-105"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-cupcake-coral to-cupcake-cherry">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { icon: ChefHat, number: '50+', label: 'Unique Recipes', emoji: '📝' },
              { icon: Heart, number: '10K+', label: 'Happy Bakers', emoji: '👩‍🍳' },
              { icon: Star, number: '4.9', label: 'Average Rating', emoji: '⭐' },
              { icon: Users, number: '25K+', label: 'Community Members', emoji: '👥' },
            ].map((stat, index) => (
              <div key={index} className="transform transition-all duration-300 hover:scale-110 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl mb-2">{stat.emoji}</div>
                <div className="font-quicksand text-4xl font-black mb-2">{stat.number}</div>
                <div className="font-nunito text-white/90 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Recipes Section */}
      <section id="recipes" className="py-32 bg-gradient-to-br from-cupcake-cream via-cupcake-vanilla to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-quicksand text-5xl font-black text-gray-900 mb-6">
              Recipe <span className="text-cupcake-coral">Collection</span> 📚
            </h2>
            <p className="font-nunito text-xl text-gray-700 max-w-2xl mx-auto font-medium">
              Every cupcake tells a story. Explore our complete collection of carefully crafted recipes.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Filter className="w-5 h-5 text-gray-500 mr-2 mt-2" />
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-cupcake-coral text-white shadow-lg font-bold'
                    : 'bg-white text-gray-700 hover:bg-cupcake-pink hover:text-cupcake-coral shadow-sm font-medium'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          {/* Recipe Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 bg-gradient-to-br from-cupcake-coral to-cupcake-cherry relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 text-6xl opacity-20 animate-float">🧁</div>
          <div className="absolute bottom-20 right-20 text-8xl opacity-15 animate-float" style={{ animationDelay: '1s' }}>🍰</div>
          <div className="absolute top-1/2 left-1/4 text-4xl opacity-25 animate-float" style={{ animationDelay: '2s' }}>🎂</div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="font-quicksand text-5xl font-black text-white mb-8">
            Ready to Start Baking? 🥧
          </h2>
          <p className="font-nunito text-xl text-white/90 mb-12 font-medium">
            Join thousands of bakers who have transformed their kitchens with our incredible recipes.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/about"
              className="font-quicksand px-10 py-5 bg-white text-cupcake-coral font-bold text-lg rounded-full hover:bg-cupcake-cream transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              👩‍🍳 Learn About Me
            </Link>
            <Link
              to="/contact"
              className="font-quicksand px-10 py-5 border-3 border-white text-white font-bold text-lg rounded-full hover:bg-white hover:text-cupcake-coral transition-all duration-300 transform hover:scale-105"
            >
              💌 Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;