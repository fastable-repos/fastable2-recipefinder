import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import FavoritesPage from './components/FavoritesPage';
import ErrorBoundary from './components/ErrorBoundary';

const FAVORITES_KEY = 'recipefinder_favorites';

function loadFavorites(): string[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as string[];
  } catch (err) {
    console.error('Failed to load favorites from localStorage:', err);
    return [];
  }
}

function saveFavorites(favorites: string[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (err) {
    console.error('Failed to save favorites to localStorage:', err);
  }
}

function AppContent() {
  const [favorites, setFavorites] = useState<string[]>(() => loadFavorites());

  const handleFavoriteToggle = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((fid) => fid !== id)
        : [...prev, id];
      saveFavorites(next);
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<HomePage favorites={favorites} onFavoriteToggle={handleFavoriteToggle} />}
        />
        <Route
          path="/favorites"
          element={<FavoritesPage favorites={favorites} onFavoriteToggle={handleFavoriteToggle} />}
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
