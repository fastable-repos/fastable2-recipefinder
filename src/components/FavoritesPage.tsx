import { useState } from 'react';
import { Link } from 'react-router-dom';
import { recipes } from '../data/recipes';
import type { Recipe } from '../data/recipes';
import RecipeCard from './RecipeCard';
import RecipeModal from './RecipeModal';

interface FavoritesPageProps {
  favorites: string[];
  onFavoriteToggle: (id: string) => void;
}

export default function FavoritesPage({ favorites, onFavoriteToggle }: FavoritesPageProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const favoriteRecipes = recipes.filter((r) => favorites.includes(r.id));

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Favorite Recipes</h1>

        {favoriteRecipes.length === 0 ? (
          <div
            data-testid="no-favorites"
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="text-7xl mb-4">💔</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No favorites yet</h2>
            <p className="text-gray-500 mb-6">Start exploring and save recipes you love!</p>
            <Link
              to="/"
              className="px-6 py-3 bg-[#E63946] text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
            >
              Browse Recipes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorited={true}
                onFavoriteToggle={onFavoriteToggle}
                onClick={setSelectedRecipe}
              />
            ))}
          </div>
        )}
      </main>

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          isFavorited={favorites.includes(selectedRecipe.id)}
          onFavoriteToggle={onFavoriteToggle}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </>
  );
}
