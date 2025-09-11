import React from 'react';
import { useState, useEffect } from 'react';
import { Heart, Instagram, Facebook, Twitter, Mail, Sparkles } from 'lucide-react';
import Logo from './Logo';
import { useIsClient } from '../hooks/useIsClient';

const Footer = () => {
  const isClient = useIsClient();

  return (
    <footer className="bg-gradient-to-br from-cupcake-coral via-cupcake-cherry to-sunshine-600 text-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {isClient && (
          <>
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float-random opacity-10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${8 + Math.random() * 4}s`,
              }}
            >
              {i % 3 === 0 ? '🧁' : i % 3 === 1 ? '🍰' : '🎂'}
            </div>
          ))}
          </>
        )}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Logo />
            </div>
            <p className="font-nunito text-pink-100 mb-6 max-w-md">
              Discover the most innovative and delicious cupcake recipes that cater to every taste and dietary preference. From classic favorites to unique creations.
            </p>
            <div className="flex space-x-4">
              {[Instagram, Facebook, Twitter, Mail].map((Icon, index) => (
                <a
                  key={index}
                  href={
                    index === 0 ? "https://instagram.com/incrediblecupcakes" :
                    index === 1 ? "https://facebook.com/incrediblecupcakes" :
                    index === 2 ? "https://twitter.com/incrediblecupcakes" :
                    "mailto:sarah@incr-ediblecupcakes.com"
                  }
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:rotate-12"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-quicksand font-bold text-lg mb-4 flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              Quick Links
            </h4>
            <ul className="space-y-2 text-pink-100 font-nunito">
              {[
                { name: 'All Recipes', path: '/recipes' },
                { name: 'Keto Cupcakes', path: '/categories/keto' },
                { name: 'Vegan Options', path: '/categories/vegan' },
                { name: 'Nut-Free', path: '/categories/nut-free' },
                { name: 'About Me', path: '/about' },
                { name: 'Contact', path: '/contact' }
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.path} className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-quicksand font-bold text-lg mb-4">Stay Updated</h4>
            <p className="font-nunito text-pink-100 text-sm mb-4">
              Get the latest recipes delivered to your inbox!
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-l-lg text-white placeholder-pink-200 focus:outline-none focus:border-white/40 font-nunito"
              />
              <button className="px-4 py-2 bg-sunshine-400 hover:bg-sunshine-500 rounded-r-lg transition-all duration-300 hover:scale-105">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="font-nunito text-pink-200 text-sm">
            © 2025 Incr-EdibleCupCakes. Made with <Heart className="w-4 h-4 text-sunshine-300 inline mx-1 animate-pulse" /> for cupcake lovers.
          </p>
          <p className="font-nunito text-pink-200 text-sm mt-2 md:mt-0">
            Domain: incr-ediblecupcakes.com
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;