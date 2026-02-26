import { useEffect } from 'react';
import type { Recipe } from '../data/recipes';

interface RecipeModalProps {
  recipe: Recipe;
  isFavorited: boolean;
  onFavoriteToggle: (id: string) => void;
  onClose: () => void;
}

export default function RecipeModal({ recipe, isFavorited, onFavoriteToggle, onClose }: RecipeModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        data-testid="recipe-modal"
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header Image */}
        <div className="relative">
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="w-full h-56 object-cover rounded-t-2xl"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://picsum.photos/400/300';
            }}
          />
          {/* Close Button */}
          <button
            data-testid="modal-close"
            onClick={onClose}
            className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-700 font-bold text-xl"
            aria-label="Close modal"
          >
            ×
          </button>
          {/* Heart Button */}
          <button
            onClick={() => onFavoriteToggle(recipe.id)}
            className="absolute top-3 right-16 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform text-lg"
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorited ? '❤️' : '🤍'}
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h2
            data-testid="modal-recipe-name"
            className="text-2xl font-bold text-gray-800 mb-2"
          >
            {recipe.name}
          </h2>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
              {recipe.cuisine}
            </span>
            {recipe.dietaryTags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                {tag}
              </span>
            ))}
          </div>

          {/* Meta Row */}
          <div className="flex gap-6 mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-xl">⏱️</span>
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">Cook Time</div>
                <div data-testid="modal-cook-time" className="font-semibold">
                  {recipe.cookTime}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-xl">👥</span>
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">Servings</div>
                <div data-testid="modal-servings" className="font-semibold">
                  {recipe.servings}
                </div>
              </div>
            </div>
          </div>

          {/* Two-column: Ingredients + Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ingredients */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">Ingredients</h3>
              <ul data-testid="modal-ingredients" className="space-y-2">
                {recipe.ingredients.map((ingredient, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-[#F4A261] flex-shrink-0" />
                    <span className="capitalize">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">Instructions</h3>
              <ol data-testid="modal-instructions" className="space-y-3">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="flex gap-3 text-gray-700">
                    <span className="w-6 h-6 rounded-full bg-[#E63946] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
