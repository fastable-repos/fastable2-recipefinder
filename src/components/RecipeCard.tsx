import type { Recipe } from '../data/recipes';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorited: boolean;
  onFavoriteToggle: (id: string) => void;
  onClick: (recipe: Recipe) => void;
}

export default function RecipeCard({ recipe, isFavorited, onFavoriteToggle, onClick }: RecipeCardProps) {
  return (
    <div
      data-testid="recipe-card"
      data-recipe-id={recipe.id}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer overflow-hidden"
      onClick={() => onClick(recipe)}
    >
      {/* Image */}
      <div className="relative">
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://picsum.photos/400/300';
          }}
        />
        {/* Heart Button */}
        <button
          data-testid={`heart-btn-${recipe.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle(recipe.id);
          }}
          className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <span className="text-lg">{isFavorited ? '❤️' : '🤍'}</span>
        </button>
        {/* Cuisine Badge */}
        <span className="absolute bottom-3 left-3 bg-blue-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {recipe.cuisine}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{recipe.name}</h3>

        {/* Dietary Tags */}
        {recipe.dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {recipe.dietaryTags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-2 py-0.5 bg-green-100 text-green-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <span>⏱️</span>
            <span>{recipe.cookTime}</span>
          </span>
          <span className="flex items-center gap-1">
            <span>👥</span>
            <span>{recipe.servings} servings</span>
          </span>
        </div>
      </div>
    </div>
  );
}
