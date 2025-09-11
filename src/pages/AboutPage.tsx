import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, Award, Users, BookOpen, Instagram, Mail } from 'lucide-react';
import ClientOnly from '../components/ClientOnly';

const AboutPage = () => {
  return (
    <div className="pt-16 lg:pt-20">
      <Helmet>
        <title>About Sarah - Professional Baker & Recipe Developer | Incr-EdibleCupCakes</title>
        <meta name="description" content="Meet Sarah, the professional baker behind Incr-EdibleCupCakes. Le Cordon Bleu graduate specializing in innovative cupcake recipes for all dietary needs including keto, vegan, and allergen-free options." />
        <meta name="keywords" content="Sarah baker, professional baker, Le Cordon Bleu, cupcake recipe developer, keto baking expert, vegan baking, allergen-free baking, pastry chef" />
        <link rel="canonical" href="https://incr-ediblecupcakes.com/about" />
        
        {/* Open Graph */}
        <meta property="og:title" content="About Sarah - Professional Baker | Incr-EdibleCupCakes" />
        <meta property="og:description" content="Meet Sarah, the professional baker behind Incr-EdibleCupCakes. Le Cordon Bleu graduate specializing in innovative cupcake recipes." />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://incr-ediblecupcakes.com/about" />
        <meta property="og:image" content="https://incr-ediblecupcakes.com/Sarah.png" />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Sarah - Professional Baker | Incr-EdibleCupCakes" />
        <meta name="twitter:description" content="Meet Sarah, the professional baker behind Incr-EdibleCupCakes. Le Cordon Bleu graduate specializing in innovative cupcake recipes." />
        <meta name="twitter:image" content="https://incr-ediblecupcakes.com/Sarah.png" />
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Sarah",
            "jobTitle": "Professional Baker & Recipe Developer",
            "description": "Le Cordon Bleu graduate and professional baker specializing in innovative cupcake recipes for all dietary preferences",
            "url": "https://incr-ediblecupcakes.com/about",
            "image": "https://incr-ediblecupcakes.com/Sarah.png",
            "alumniOf": {
              "@type": "EducationalOrganization",
              "name": "Le Cordon Bleu"
            },
            "knowsAbout": [
              "Cupcake Baking",
              "Keto Baking",
              "Vegan Baking",
              "Allergen-Free Baking",
              "Pastry Arts",
              "Recipe Development"
            ],
            "award": [
              "Best Bakery 2024",
              "Published Author - Innovative Cupcakes for Everyone"
            ],
            "worksFor": {
              "@type": "Organization",
              "name": "Incr-EdibleCupCakes"
            }
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-cupcake-coral via-sunshine-400 to-cupcake-cherry overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <ClientOnly>
            <>
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-float-random opacity-20"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: `${4 + i * 0.5}s`,
                  }}
                >
                  {i % 4 === 0 ? '🧁' : i % 4 === 1 ? '🍰' : i % 4 === 2 ? '🎂' : '🧁'}
                </div>
              ))}
            </>
          </ClientOnly>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="font-quicksand text-4xl sm:text-5xl font-black mb-6 leading-tight drop-shadow-2xl">
                Meet the Baker Behind the
                <span className="block text-sunshine-300 animate-gradient-text">Magic</span>
              </h1>
              <p className="font-nunito text-xl text-pink-100 leading-relaxed drop-shadow-lg">
                Hi, I'm Sarah! A passionate baker who believes that every cupcake should be an extraordinary experience. 
                My journey began in my grandmother's kitchen and has evolved into creating innovative recipes that 
                bring joy to people with diverse dietary needs.
              </p>
            </div>
            
            <div className="relative">
              <div className="w-80 h-80 mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-rose-400 rounded-full animate-pulse" />
                <img
                  src="/Sarah.png"
                  alt="Sarah - The baker behind Incr-EdibleCupCakes"
                  className="relative z-10 w-full h-full object-cover rounded-full border-4 border-white/20 shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <Heart className="w-8 h-8 text-cupcake-coral" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-quicksand text-4xl font-black text-gray-900 mb-6">
              My <span className="text-cupcake-coral">Journey</span>
            </h2>
          </div>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <img
                  src="/Where It All Began.jpg"
                  alt="Baking in grandmother's kitchen"
                  className="w-full h-64 object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div className="md:w-1/2">
                <h3 className="font-quicksand text-2xl font-bold text-gray-900 mb-4">Where It All Began</h3>
                <p className="font-nunito text-gray-600 leading-relaxed">
                  My love for baking started at age 7 in my grandmother's cozy kitchen. She taught me that baking 
                  isn't just about following recipes—it's about creating moments of joy and bringing people together. 
                  Every Saturday morning, we'd experiment with new flavors and techniques, always pushing the boundaries 
                  of traditional baking.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="md:w-1/2">
                <img
                  src="/Professional Training.jpg"
                  alt="Culinary school graduation"
                  className="w-full h-64 object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div className="md:w-1/2">
                <h3 className="font-quicksand text-2xl font-bold text-gray-900 mb-4">Professional Training</h3>
                <p className="font-nunito text-gray-600 leading-relaxed">
                  After graduating from Le Cordon Bleu, I specialized in pastry arts and nutritional baking. 
                  I became passionate about creating delicious treats that everyone can enjoy, regardless of dietary 
                  restrictions. This led me to develop innovative techniques for keto, vegan, and allergen-free baking.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <img
                  src="/Innovation in Every Bite.jpg"
                  alt="Modern baking studio"
                  className="w-full h-64 object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div className="md:w-1/2">
                <h3 className="font-quicksand text-2xl font-bold text-gray-900 mb-4">Innovation in Every Bite</h3>
                <p className="font-nunito text-gray-600 leading-relaxed">
                  Today, I run my own baking studio where I develop and test every recipe featured on this site. 
                  Each cupcake represents hours of experimentation, taste-testing, and refinement. My mission is to 
                  prove that dietary restrictions never mean compromising on flavor or beauty.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-gradient-to-br from-cupcake-pink/20 to-sunshine-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-quicksand text-4xl font-black text-gray-900 mb-6">
              Achievements & <span className="text-cupcake-coral">Recognition</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: 'Best Bakery 2024',
                description: 'Voted best specialty bakery in the region',
                color: 'bg-sunshine-400'
              },
              {
                icon: BookOpen,
                title: 'Published Author',
                description: 'Author of "Innovative Cupcakes for Everyone"',
                color: 'bg-sprinkle-blue'
              },
              {
                icon: Users,
                title: '50K+ Students',
                description: 'Taught thousands through online courses',
                color: 'bg-sprinkle-green'
              },
              {
                icon: Heart,
                title: 'Community Impact',
                description: 'Donated 10,000+ cupcakes to local charities',
                color: 'bg-cupcake-coral'
              }
            ].map((achievement, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center"
              >
                <div className={`w-16 h-16 ${achievement.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <achievement.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-quicksand text-xl font-bold text-gray-900 mb-2">{achievement.title}</h3>
                <p className="font-nunito text-gray-600">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-quicksand text-4xl font-black text-gray-900 mb-8">
            My Baking <span className="text-cupcake-coral">Philosophy</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: 'Inclusivity',
                description: 'Every person deserves to enjoy incredible desserts, regardless of dietary needs.',
                icon: '🤝'
              },
              {
                title: 'Innovation',
                description: 'Traditional techniques meet modern nutritional science for extraordinary results.',
                icon: '💡'
              },
              {
                title: 'Quality',
                description: 'Only the finest ingredients and meticulous attention to detail in every recipe.',
                icon: '⭐'
              }
            ].map((principle, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{principle.icon}</div>
                <h3 className="font-quicksand text-xl font-bold text-gray-900 mb-3">{principle.title}</h3>
                <p className="font-nunito text-gray-600">{principle.description}</p>
              </div>
            ))}
          </div>

          <blockquote className="font-nunito text-2xl font-medium text-gray-900 italic mb-8">
            "Baking is my way of spreading happiness, one cupcake at a time. Every recipe I create 
            is infused with love and the belief that extraordinary flavors should be accessible to everyone."
          </blockquote>
          
          <div className="flex justify-center space-x-6">
            <a
              href="https://instagram.com/incrediblecupcakes"
              className="font-quicksand flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cupcake-coral to-sunshine-400 text-white rounded-full hover:from-cupcake-cherry hover:to-sunshine-500 transition-all duration-300 transform hover:scale-105 font-bold"
            >
              <Instagram className="w-5 h-5" />
              <span>Follow My Journey</span>
            </a>
            <a
              href="mailto:sarah@incr-ediblecupcakes.com"
              className="font-quicksand flex items-center space-x-2 px-6 py-3 border-2 border-cupcake-coral text-cupcake-coral rounded-full hover:bg-cupcake-coral hover:text-white transition-all duration-300 transform hover:scale-105 font-bold"
            >
              <Mail className="w-5 h-5" />
              <span>Say Hello</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;