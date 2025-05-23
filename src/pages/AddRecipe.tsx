import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Ingredient, Instruction } from '../types/Recipe';

interface FormData {
  title: string;
  description: string;
  image: File | null;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: Ingredient[];
  instructions: Instruction[];
  categories: string[];
  tags: string[];
}

interface FormErrors {
  [key: string]: string;
}

export default function AddRecipe() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    image: null,
    prepTime: 0,
    cookTime: 0,
    servings: 4,
    difficulty: 'medium',
    ingredients: [{ amount: 0, unit: '', name: '' }],
    instructions: [{ text: '' }],
    categories: [],
    tags: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!formData.image) {
      errors.image = 'Image is required';
    }
    if (formData.prepTime < 0) {
      errors.prepTime = 'Prep time cannot be negative';
    }
    if (formData.cookTime < 0) {
      errors.cookTime = 'Cook time cannot be negative';
    }
    if (formData.servings < 1) {
      errors.servings = 'At least one serving is required';
    }
    if (formData.ingredients.some(ing => !ing.name.trim() || ing.amount <= 0 || !ing.unit.trim())) {
      errors.ingredients = 'All ingredient fields are required and amount must be positive';
    }
    if (formData.instructions.some(inst => !inst.text.trim())) {
      errors.instructions = 'All instruction steps are required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formDataToSend.append(key, value);
        } else if (typeof value === 'object') {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, String(value));
        }
      });

      const response = await fetch('/api/recipes', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to create recipe');
      }

      navigate('/recipes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { amount: 0, unit: '', name: '' }],
    });
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string | number) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = { 
      ...newIngredients[index], 
      [field]: field === 'amount' ? Number(value) : value 
    };
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const removeIngredient = (index: number) => {
    if (formData.ingredients.length > 1) {
      setFormData({
        ...formData,
        ingredients: formData.ingredients.filter((_, i) => i !== index),
      });
    }
  };

  const addInstruction = () => {
    setFormData({
      ...formData,
      instructions: [...formData.instructions, { text: '' }],
    });
  };

  const updateInstruction = (index: number, text: string) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = { text };
    setFormData({ ...formData, instructions: newInstructions });
  };

  const removeInstruction = (index: number) => {
    if (formData.instructions.length > 1) {
      setFormData({
        ...formData,
        instructions: formData.instructions.filter((_, i) => i !== index),
      });
    }
  };

  return (
    <main className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-8">Add New Recipe</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-error/10 text-error p-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <section className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full"
                required
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Recipe preview"
                  className="mt-2 h-48 w-full object-cover rounded-lg"
                />
              )}
            </div>
          </section>

          {/* Recipe Details */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700">
                Prep Time (minutes)
              </label>
              <input
                type="number"
                id="prepTime"
                value={formData.prepTime}
                onChange={(e) => setFormData({ ...formData, prepTime: Number(e.target.value) })}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700">
                Cook Time (minutes)
              </label>
              <input
                type="number"
                id="cookTime"
                value={formData.cookTime}
                onChange={(e) => setFormData({ ...formData, cookTime: Number(e.target.value) })}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="servings" className="block text-sm font-medium text-gray-700">
                Servings
              </label>
              <input
                type="number"
                id="servings"
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: Number(e.target.value) })}
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              />
            </div>
          </section>

          {/* Ingredients */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-primary">Ingredients</h2>
              <button
                type="button"
                onClick={addIngredient}
                className="text-primary hover:text-primary-dark"
              >
                Add Ingredient
              </button>
            </div>
            <div className="space-y-4">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <input
                    type="number"
                    value={ingredient.amount}
                    onChange={(e) => updateIngredient(index, 'amount', Number(e.target.value))}
                    placeholder="Amount"
                    className="w-24 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                  <input
                    type="text"
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                    placeholder="Unit"
                    className="w-24 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                  <input
                    type="text"
                    value={ingredient.name}
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                    placeholder="Ingredient name"
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="text-error hover:text-error/80"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Instructions */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-primary">Instructions</h2>
              <button
                type="button"
                onClick={addInstruction}
                className="text-primary hover:text-primary-dark"
              >
                Add Step
              </button>
            </div>
            <div className="space-y-4">
              {formData.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <span className="mt-2 font-mono text-primary">{index + 1}.</span>
                  <textarea
                    value={instruction.text}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    placeholder="Instruction step"
                    rows={2}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    className="text-error hover:text-error/80"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Recipe...' : 'Create Recipe'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
} 