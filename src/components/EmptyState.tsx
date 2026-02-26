interface EmptyStateProps {
  onReset: () => void;
}

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div
      data-testid="empty-state"
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="text-7xl mb-4">🔍</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">No recipes found</h2>
      <p className="text-gray-500 mb-6">Try adjusting your ingredients or filters</p>
      <button
        onClick={onReset}
        data-testid="empty-state-reset"
        className="px-6 py-3 bg-[#E63946] text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
}
