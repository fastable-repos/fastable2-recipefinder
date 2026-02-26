import { test, expect } from '@playwright/test';
import { mkdirSync } from 'fs';

test.beforeAll(() => {
  mkdirSync('e2e/screenshots', { recursive: true });
});

// ─── 1. Happy path – Search by ingredient ───────────────────────────────────
test('1. Search by ingredient shows only matching recipes', async ({ page }) => {
  await page.goto('/');

  // All 14 recipes should be visible initially
  await expect(page.locator('[data-testid="recipe-card"]')).toHaveCount(14);

  // Take screenshot of main browse screen (all recipes)
  await page.screenshot({ path: 'e2e/screenshots/main-browse.png', fullPage: true });

  // Type 'chicken' into ingredient search
  await page.fill('[data-testid="ingredient-search"]', 'chicken');

  // Expect exactly 3 chicken recipes
  await expect(page.locator('[data-testid="recipe-card"]')).toHaveCount(3);

  // Chicken recipes should be visible
  await expect(page.locator('[data-recipe-id="chicken-tikka-masala"]')).toBeVisible();
  await expect(page.locator('[data-recipe-id="chicken-caesar-salad"]')).toBeVisible();
  await expect(page.locator('[data-recipe-id="chicken-quesadilla"]')).toBeVisible();

  // Non-chicken recipe should NOT be in the DOM
  await expect(page.locator('[data-recipe-id="spaghetti-carbonara"]')).not.toBeAttached();
  await expect(page.locator('[data-recipe-id="margherita-pizza"]')).not.toBeAttached();

  await page.screenshot({ path: 'e2e/screenshots/ingredient-search.png', fullPage: true });
});

// ─── 2. Happy path – Filter by dietary restriction ──────────────────────────
test('2. Filter by Vegan shows only vegan recipes', async ({ page }) => {
  await page.goto('/');

  await page.click('[data-testid="dietary-tag-Vegan"]');

  // 3 vegan recipes: vegan-buddha-bowl, tofu-stir-fry, black-bean-tacos
  await expect(page.locator('[data-testid="recipe-card"]')).toHaveCount(3);

  await expect(page.locator('[data-recipe-id="vegan-buddha-bowl"]')).toBeVisible();
  await expect(page.locator('[data-recipe-id="tofu-stir-fry"]')).toBeVisible();
  await expect(page.locator('[data-recipe-id="black-bean-tacos"]')).toBeVisible();

  // Non-vegan recipes should NOT be present
  await expect(page.locator('[data-recipe-id="spaghetti-carbonara"]')).not.toBeAttached();
  await expect(page.locator('[data-recipe-id="chicken-tikka-masala"]')).not.toBeAttached();
});

// ─── 3. Happy path – Filter by cuisine type ─────────────────────────────────
test('3. Filter by Italian cuisine shows only Italian recipes', async ({ page }) => {
  await page.goto('/');

  await page.click('[data-testid="cuisine-filter-Italian"]');

  // 3 Italian recipes: spaghetti-carbonara, margherita-pizza, mushroom-risotto
  await expect(page.locator('[data-testid="recipe-card"]')).toHaveCount(3);

  await expect(page.locator('[data-recipe-id="spaghetti-carbonara"]')).toBeVisible();
  await expect(page.locator('[data-recipe-id="margherita-pizza"]')).toBeVisible();
  await expect(page.locator('[data-recipe-id="mushroom-risotto"]')).toBeVisible();

  // Non-Italian recipes should NOT be present
  await expect(page.locator('[data-recipe-id="street-tacos"]')).not.toBeAttached();
  await expect(page.locator('[data-recipe-id="pad-thai"]')).not.toBeAttached();
});

// ─── 4. Happy path – Combined filters ───────────────────────────────────────
test('4. Combined ingredient + dietary + cuisine filter shows only matching recipe', async ({ page }) => {
  await page.goto('/');

  // ingredient=tofu, dietary=Vegan, cuisine=Asian → only tofu-stir-fry
  await page.fill('[data-testid="ingredient-search"]', 'tofu');
  await page.click('[data-testid="dietary-tag-Vegan"]');
  await page.click('[data-testid="cuisine-filter-Asian"]');

  await expect(page.locator('[data-testid="recipe-card"]')).toHaveCount(1);
  await expect(page.locator('[data-recipe-id="tofu-stir-fry"]')).toBeVisible();

  // Nothing else should be present
  await expect(page.locator('[data-recipe-id="vegan-buddha-bowl"]')).not.toBeAttached();
  await expect(page.locator('[data-recipe-id="pad-thai"]')).not.toBeAttached();
});

// ─── 5. Happy path – View recipe detail ─────────────────────────────────────
test('5. Clicking a recipe card opens the detail modal', async ({ page }) => {
  await page.goto('/');

  // Click on Spaghetti Carbonara card
  await page.click('[data-recipe-id="spaghetti-carbonara"]');

  // Modal should appear
  await expect(page.locator('[data-testid="recipe-modal"]')).toBeVisible();

  // Check recipe name
  await expect(page.locator('[data-testid="modal-recipe-name"]')).toHaveText('Spaghetti Carbonara');

  // Check cook time and servings
  await expect(page.locator('[data-testid="modal-cook-time"]')).toHaveText('25 mins');
  await expect(page.locator('[data-testid="modal-servings"]')).toHaveText('4');

  // Check ingredients list is present and has items
  const ingredientsList = page.locator('[data-testid="modal-ingredients"] li');
  await expect(ingredientsList).toHaveCount(6);

  // Check instructions list is present and has items
  const instructionsList = page.locator('[data-testid="modal-instructions"] li');
  await expect(instructionsList).toHaveCount(8);

  // Take screenshot of modal
  await page.screenshot({ path: 'e2e/screenshots/recipe-detail-modal.png' });

  // Close the modal
  await page.click('[data-testid="modal-close"]');
  await expect(page.locator('[data-testid="recipe-modal"]')).not.toBeVisible();
});

// ─── 6. Happy path – Save and view favorite ─────────────────────────────────
test('6. Favoriting a recipe shows it on the Favorites page', async ({ page }) => {
  await page.goto('/');

  // Click heart on Spaghetti Carbonara
  await page.click('[data-testid="heart-btn-spaghetti-carbonara"]');

  // Navigate to Favorites tab
  await page.click('[data-testid="favorites-tab"]');

  // The recipe should appear on the Favorites page
  await expect(page.locator('[data-recipe-id="spaghetti-carbonara"]')).toBeVisible();

  // Take screenshot of favorites page with a recipe
  await page.screenshot({ path: 'e2e/screenshots/favorites-page.png', fullPage: true });
});

// ─── 7. Data persistence – Favorites survive page reload ────────────────────
test('7. Favorites persist after page reload', async ({ page }) => {
  await page.goto('/');

  // Favorite a recipe
  await page.click('[data-testid="heart-btn-margherita-pizza"]');

  // Verify it's in localStorage
  const stored = await page.evaluate(() => localStorage.getItem('recipefinder_favorites'));
  expect(stored).toContain('margherita-pizza');

  // Reload the page
  await page.reload();

  // Navigate to Favorites
  await page.click('[data-testid="favorites-tab"]');

  // Recipe should still be there
  await expect(page.locator('[data-recipe-id="margherita-pizza"]')).toBeVisible();
});

// ─── 8. Edge case – No results empty state ──────────────────────────────────
test('8. Searching for a non-existent ingredient shows empty state', async ({ page }) => {
  await page.goto('/');

  await page.fill('[data-testid="ingredient-search"]', 'zzznomatch');

  // No recipe cards should be visible
  await expect(page.locator('[data-testid="recipe-card"]')).toHaveCount(0);

  // Empty state message should appear
  await expect(page.locator('[data-testid="empty-state"]')).toBeVisible();
  await expect(page.locator('[data-testid="empty-state"]')).toContainText('No recipes found');

  // Take screenshot of empty state
  await page.screenshot({ path: 'e2e/screenshots/empty-search-results.png', fullPage: true });
});

// ─── 9. Edge case – Reset filters ───────────────────────────────────────────
test('9. Reset Filters clears all active filters and shows all recipes', async ({ page }) => {
  await page.goto('/');

  // Apply filters that together show 0 results (chicken + Vegan)
  await page.fill('[data-testid="ingredient-search"]', 'chicken');
  await page.click('[data-testid="dietary-tag-Vegan"]');

  // Should be empty
  await expect(page.locator('[data-testid="recipe-card"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="empty-state"]')).toBeVisible();

  // Click Reset Filters
  await page.click('[data-testid="reset-filters"]');

  // All 14 recipes should be visible again
  await expect(page.locator('[data-testid="recipe-card"]')).toHaveCount(14);

  // Search input should be cleared
  await expect(page.locator('[data-testid="ingredient-search"]')).toHaveValue('');

  // Vegan tag should no longer be active (it's not selected)
  const veganBtn = page.locator('[data-testid="dietary-tag-Vegan"]');
  await expect(veganBtn).not.toHaveClass(/bg-green-500/);
});

// ─── 10. Edge case – Remove from favorites ──────────────────────────────────
test('10. Removing a favorite from the Favorites page updates the list and localStorage', async ({ page }) => {
  await page.goto('/');

  // Favorite Greek Salad
  await page.click('[data-testid="heart-btn-greek-salad"]');

  // Navigate to Favorites
  await page.click('[data-testid="favorites-tab"]');

  // Greek Salad should be visible
  await expect(page.locator('[data-recipe-id="greek-salad"]')).toBeVisible();

  // Click the heart button to unfavorite it
  await page.click('[data-testid="heart-btn-greek-salad"]');

  // The recipe card should no longer be in the list
  await expect(page.locator('[data-recipe-id="greek-salad"]')).not.toBeAttached();

  // No-favorites empty state should appear
  await expect(page.locator('[data-testid="no-favorites"]')).toBeVisible();

  // localStorage should not contain the recipe id
  const stored = await page.evaluate(() => localStorage.getItem('recipefinder_favorites'));
  expect(stored).not.toContain('greek-salad');
});
