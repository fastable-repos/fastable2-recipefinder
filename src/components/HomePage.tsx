import { useState } from 'react';
import { recipes } from '../data/recipes';
import type { Recipe } from '../data/recipes';
import FilterBar from './FilterBar';
import RecipeCard from './RecipeCard';
import RecipeModal from './RecipeModal';
import EmptyState from './EmptyState';

interface HomePageProps {
  favorites: string[];
  onFavoriteToggle: (id: string) => void;
}

export default function HomePage({ favorites, onFavoriteToggle }: HomePageProps) {
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [selectedDietaryTags, setSelectedDietaryTags] = useState<string[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const handleDietaryTagToggle = (tag: string) => {
    setSelectedDietaryTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleReset = () => {
    setIngredientSearch('');
    setSelectedDietaryTags([]);
    setSelectedCuisine('');
  };

  const filteredRecipes = recipes.filter((recipe) => {
    // Ingredient filter
    if (ingredientSearch.trim()) {
      const searchIngredients = ingredientSearch
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      const hasAllIngredients = searchIngredients.every((searchIng) =>
        recipe.ingredients.some((ing) => ing.toLowerCase().includes(searchIng)),
      );
      if (!hasAllIngredients) return false;
    }

    // Dietary tags filter
    if (selectedDietaryTags.length > 0) {
      const hasAllTags = selectedDietaryTags.every((tag) =>
        recipe.dietaryTags.includes(tag),
      );
      if (!hasAllTags) return false;
    }

    // Cuisine filter
    if (selectedCuisine && recipe.cuisine !== selectedCuisine) return false;

    return true;
  });

  return (
    <>
      <FilterBar
        ingredientSearch={ingredientSearch}
        selectedDietaryTags={selectedDietaryTags}
        selectedCuisine={selectedCuisine}
        onIngredientChange={setIngredientSearch}
        onDietaryTagToggle={handleDietaryTagToggle}
        onCuisineChange={setSelectedCuisine}
        onReset={handleReset}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {filteredRecipes.length === 0 ? (
          <EmptyState onReset={handleReset} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorited={favorites.includes(recipe.id)}
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
