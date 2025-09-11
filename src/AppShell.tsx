import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RecipesPage from './pages/RecipesPage';
import CategoriesPage from './pages/CategoriesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import RecipePage from './pages/RecipePage';
import { Routes, Route } from 'react-router-dom';

export default function AppShell() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 font-nunito">
      <Helmet>
        <title>Incr-EdibleCupCakes - Extraordinary Cupcake Recipes</title>
        <meta name="description" content="Discover unique and innovative cupcake recipes for every taste and dietary preference. Professional baker Sarah shares tested recipes with step-by-step instructions." />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="author" content="Sarah - Professional Baker" />
        <meta name="rating" content="General" />
        <meta name="distribution" content="Global" />
        <meta name="theme-color" content="#f43f5e" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/Incr-EdibleCupCakes Logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/Incr-EdibleCupCakes Logo.png" />
        <link rel="apple-touch-icon" href="/Incr-EdibleCupCakes Logo.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Global Schema.org JSON-LD */}
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
      </Helmet>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/categories/:categoryId" element={<CategoriesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/recipe/:slug" element={<RecipePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}