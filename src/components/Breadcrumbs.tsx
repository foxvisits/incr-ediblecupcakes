import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  currentPageTitle?: string;
  category?: string;
}

export default function Breadcrumbs({ currentPageTitle, category }: BreadcrumbsProps) {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const breadcrumbMap: { [key: string]: string } = {
    recipes: 'Recipes',
    categories: 'Categories',
    about: 'About',
    contact: 'Contact',
    'classic': 'Classic',
    'keto': 'Keto',
    'vegan': 'Vegan',
    'nut-free': 'Nut-free',
    'gluten-free': 'Gluten-free'
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm py-2 px-4 mb-6 rounded-lg shadow-sm">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link to="/" className="flex items-center text-gray-600 hover:text-rose-500 transition-colors">
            <Home className="w-4 h-4" />
            <span className="sr-only">Strona główna</span>
          </Link>
        </li>
        
        {pathSegments.map((segment, index) => {
          const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;
          const title = currentPageTitle && isLast ? currentPageTitle : breadcrumbMap[segment] || segment;

          return (
            <li key={path} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
              {isLast ? (
                <span className="text-rose-500 font-medium">{title}</span>
              ) : (
                <Link
                  to={path}
                  className="text-gray-600 hover:text-rose-500 transition-colors"
                >
                  {title}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
