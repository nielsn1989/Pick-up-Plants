import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Recipe, Ingredient, Instruction, Tip, Substitution, Alternative } from '../types/Recipe';

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [servings, setServings] = useState<number>(4);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) {
        setError('Recipe ID is required');
        setLoading(false);
        return;
      }

      try {
        // Replace with your actual API call
        const response = await fetch(`/api/recipes/${id}`);
        if (!response.ok) {
          throw new Error('Recipe not found');
        }
        const data: Recipe = await response.json();
        setRecipe(data);
        setServings(data.servings);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-white text-xl">{error || 'Recipe not found'}</div>
      </div>
    );
  }

  const calculateAdjustedAmount = (amount: number, baseServings: number, targetServings: number): number => {
    return Number(((amount * targetServings) / baseServings).toFixed(2));
  };

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="text-4xl font-bold text-white mb-4">{recipe.title}</h1>
            <p className="text-lg text-white/90">{recipe.description}</p>
          </div>
        </div>
      </div>

      {/* Recipe Info */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="text-sm font-medium text-primary mb-1">Prep Time</h3>
            <p className="text-lg">{recipe.prepTime} mins</p>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="text-sm font-medium text-primary mb-1">Cook Time</h3>
            <p className="text-lg">{recipe.cookTime} mins</p>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="text-sm font-medium text-primary mb-1">Difficulty</h3>
            <p className="text-lg capitalize">{recipe.difficulty}</p>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="text-sm font-medium text-primary mb-1">Servings</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setServings(Math.max(1, servings - 1))}
                className="text-primary hover:text-primary-dark"
                aria-label="Decrease servings"
              >
                -
              </button>
              <span className="text-lg">{servings}</span>
              <button
                onClick={() => setServings(servings + 1)}
                className="text-primary hover:text-primary-dark"
                aria-label="Increase servings"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient: Ingredient, index: number) => (
              <li key={index} className="flex items-center space-x-2">
                <span className="font-mono">
                  {calculateAdjustedAmount(ingredient.amount, recipe.servings, servings)}
                  {ingredient.unit}
                </span>
                <span>{ingredient.name}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Instructions */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">Instructions</h2>
          <ol className="space-y-4">
            {recipe.instructions.map((instruction: Instruction, index: number) => (
              <li key={index} className="flex items-start space-x-4">
                <span className="font-mono text-primary">{index + 1}.</span>
                <div>
                  <p>{instruction.text}</p>
                  {instruction.image && (
                    <img
                      src={instruction.image}
                      alt={`Step ${index + 1}`}
                      className="mt-2 rounded-lg"
                    />
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Tips */}
        {recipe.tips && recipe.tips.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Tips</h2>
            <ul className="space-y-2">
              {recipe.tips.map((tip: Tip, index: number) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-accent">•</span>
                  <span>{tip.text}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Substitutions */}
        {recipe.substitutions && recipe.substitutions.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Substitutions</h2>
            <ul className="space-y-4">
              {recipe.substitutions.map((sub: Substitution, index: number) => (
                <li key={index}>
                  <h3 className="font-medium text-primary">{sub.ingredient}</h3>
                  <ul className="mt-2 ml-4 space-y-1">
                    {sub.alternatives.map((alt: Alternative, i: number) => (
                      <li key={i}>
                        • {alt.name}
                        {alt.notes && <span className="text-sm text-gray-600"> ({alt.notes})</span>}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Tags */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-secondary text-primary text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
} 