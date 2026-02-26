import { DIETARY_TAGS, CUISINES } from '../data/recipes';

interface FilterBarProps {
  ingredientSearch: string;
  selectedDietaryTags: string[];
  selectedCuisine: string;
  onIngredientChange: (value: string) => void;
  onDietaryTagToggle: (tag: string) => void;
  onCuisineChange: (cuisine: string) => void;
  onReset: () => void;
}

export default function FilterBar({
  ingredientSearch,
  selectedDietaryTags,
  selectedCuisine,
  onIngredientChange,
  onDietaryTagToggle,
  onCuisineChange,
  onReset,
}: FilterBarProps) {
  return (
    <div className="bg-white border-b border-gray-100 shadow-sm sticky top-[73px] z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Ingredient Search */}
        <div className="mb-4">
          <input
            type="text"
            data-testid="ingredient-search"
            placeholder="Search by ingredients (e.g. chicken, tomato...)"
            value={ingredientSearch}
            onChange={(e) => onIngredientChange(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#E63946] text-gray-700 placeholder-gray-400 transition-colors"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Dietary Tags */}
          <div className="flex flex-wrap gap-2">
            {DIETARY_TAGS.map((tag) => (
              <button
                key={tag}
                data-testid={`dietary-tag-${tag}`}
                onClick={() => onDietaryTagToggle(tag)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedDietaryTags.includes(tag)
                    ? 'bg-green-500 text-white'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 hidden sm:block" />

          {/* Cuisine Filter */}
          <div className="flex flex-wrap gap-2">
            {CUISINES.map((cuisine) => (
              <button
                key={cuisine}
                data-testid={`cuisine-filter-${cuisine}`}
                onClick={() => onCuisineChange(selectedCuisine === cuisine ? '' : cuisine)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCuisine === cuisine
                    ? 'bg-blue-500 text-white'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>

          {/* Reset Button */}
          <button
            data-testid="reset-filters"
            onClick={onReset}
            className="ml-auto px-4 py-2 text-sm font-semibold text-[#E63946] border-2 border-[#E63946] rounded-xl hover:bg-[#E63946] hover:text-white transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
