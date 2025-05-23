import { useState } from 'react';
import type { Recipe } from '../types/Recipe';

interface RecipeDetailProps {
  recipe: Recipe;
}

export default function RecipeDetail({ recipe }: RecipeDetailProps) {
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const adjustedServings = recipe.servings * servingMultiplier;

  const adjustIngredientAmount = (amount: number) => {
    return (amount * servingMultiplier).toFixed(2);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
        <p className="text-lg text-gray-600 mb-4">{recipe.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>Prep: {recipe.prepTime} mins</span>
          <span>Cook: {recipe.cookTime} mins</span>
          <span>Difficulty: {recipe.difficulty}</span>
        </div>
      </div>

      {recipe.imageUrl && (
        <div className="mb-8">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Ingredients</h2>
          <div className="flex items-center gap-4">
            <label htmlFor="servings" className="text-sm text-gray-600">
              Adjust servings:
            </label>
            <input
              type="number"
              id="servings"
              min="1"
              value={adjustedServings}
              onChange={(e) => setServingMultiplier(parseInt(e.target.value) / recipe.servings)}
              className="w-20 px-2 py-1 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <ul className="space-y-2">
          {recipe.ingredients.map((ingredient) => (
            <li key={ingredient.id} className="text-gray-700">
              {adjustIngredientAmount(ingredient.amount)} {ingredient.unit} {ingredient.name}
              {ingredient.notes && (
                <span className="text-gray-500 text-sm"> ({ingredient.notes})</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
        <ol className="space-y-4">
          {recipe.instructions.map((instruction) => (
            <li key={instruction.id} className="flex gap-4">
              <span className="font-bold text-pine-600">{instruction.step}.</span>
              <p className="text-gray-700">{instruction.description}</p>
            </li>
          ))}
        </ol>
      </div>

      {recipe.tips && recipe.tips.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tips</h2>
          <ul className="space-y-2">
            {recipe.tips.map((tip, index) => (
              <li key={index} className="text-gray-700">
                • {tip.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 