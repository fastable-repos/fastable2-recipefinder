import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isFavorites = location.pathname === '/favorites';

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🍅</span>
          <span className="text-2xl font-bold text-[#E63946]">RecipeFinder</span>
        </Link>
        <Link
          to="/favorites"
          data-testid="favorites-tab"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors ${
            isFavorites
              ? 'bg-[#E63946] text-white'
              : 'text-gray-600 hover:bg-red-50 hover:text-[#E63946]'
          }`}
        >
          <span>❤️</span>
          <span>Favorites</span>
        </Link>
      </div>
    </nav>
  );
}
