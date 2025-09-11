import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Sparkles } from 'lucide-react';
import Logo from './Logo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Recipes', path: '/recipes' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-cupcake-pink/30' 
        : 'bg-gradient-to-b from-cupcake-coral/20 to-transparent backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative font-quicksand font-bold transition-all duration-300 hover:scale-105 text-shadow-sm ${
                  location.pathname === item.path
                    ? isScrolled 
                      ? 'text-cupcake-coral shadow-rose-200' 
                      : 'text-white drop-shadow-lg'
                    : isScrolled 
                      ? 'text-gray-700 hover:text-cupcake-coral' 
                      : 'text-white/95 hover:text-white drop-shadow-md hover:drop-shadow-lg'
                }`}
              >
                {item.name}
                {location.pathname === item.path && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cupcake-coral to-sunshine-400 rounded-full animate-pulse-glow" />
                )}
              </Link>
            ))}
            <Sparkles className={`w-5 h-5 transition-colors duration-300 animate-pulse ${
              isScrolled ? 'text-sunshine-400' : 'text-sunshine-300 drop-shadow-md'
            }`} />
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
              isScrolled 
                ? 'text-gray-700 hover:bg-cupcake-pink/20' 
                : 'text-white hover:bg-white/10 drop-shadow-lg'
            }`}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white/98 backdrop-blur-xl shadow-2xl border-t border-cupcake-pink/30 animate-fade-in-down">
            <nav className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-3 px-4 rounded-xl font-quicksand font-bold transition-all duration-300 transform hover:scale-105 ${
                    location.pathname === item.path
                      ? 'text-cupcake-coral bg-gradient-to-r from-cupcake-pink/20 to-sunshine-100/50 shadow-md'
                      : 'text-gray-700 hover:text-cupcake-coral hover:bg-gradient-to-r hover:from-cupcake-pink/20 hover:to-sunshine-100/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;