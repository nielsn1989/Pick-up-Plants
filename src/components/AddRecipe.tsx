import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { Recipe, Ingredient, Instruction } from '../types/Recipe';
import { v4 as uuidv4 } from 'uuid';

export default function AddRecipe() {
  const { user, supabase } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [prepTime, setPrepTime] = useState(0);
  const [cookTime, setCookTime] = useState(0);
  const [servings, setServings] = useState(1);
  const [difficulty, setDifficulty] = useState<Recipe['difficulty']>('medium');
  const [imageUrl, setImageUrl] = useState('');

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: uuidv4(), name: '', amount: 0, unit: '' }
    ]);
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string | number) => {
    setIngredients(ingredients.map(ing => 
      ing.id === id ? { ...ing, [field]: value } : ing
    ));
  };

  const addInstruction = () => {
    const nextStep = instructions.length + 1;
    setInstructions([
      ...instructions,
      { id: uuidv4(), step: nextStep, description: '' }
    ]);
  };

  const updateInstruction = (id: string, description: string) => {
    setInstructions(instructions.map(inst =>
      inst.id === id ? { ...inst, description } : inst
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'> = {
      title,
      description,
      ingredients,
      instructions,
      prepTime,
      cookTime,
      servings,
      difficulty,
      imageUrl,
      userId: user.id
    };

    const { error } = await supabase
      .from('recipes')
      .insert([recipe]);

    if (error) {
      console.error('Error adding recipe:', error);
      return;
    }

    // Reset form
    setTitle('');
    setDescription('');
    setIngredients([]);
    setInstructions([]);
    setPrepTime(0);
    setCookTime(0);
    setServings(1);
    setDifficulty('medium');
    setImageUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pine-600 focus:ring-pine-600"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pine-600 focus:ring-pine-600"
          rows={3}
          required
        />
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">Ingredients</h3>
        {ingredients.map((ingredient) => (
          <div key={ingredient.id} className="mt-2 flex gap-2">
            <input
              type="text"
              value={ingredient.name}
              onChange={(e) => updateIngredient(ingredient.id, 'name', e.target.value)}
              placeholder="Ingredient name"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-pine-600 focus:ring-pine-600"
            />
            <input
              type="number"
              value={ingredient.amount}
              onChange={(e) => updateIngredient(ingredient.id, 'amount', parseFloat(e.target.value))}
              placeholder="Amount"
              className="w-24 rounded-md border-gray-300 shadow-sm focus:border-pine-600 focus:ring-pine-600"
            />
            <input
              type="text"
              value={ingredient.unit}
              onChange={(e) => updateIngredient(ingredient.id, 'unit', e.target.value)}
              placeholder="Unit"
              className="w-24 rounded-md border-gray-300 shadow-sm focus:border-pine-600 focus:ring-pine-600"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addIngredient}
          className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-pine-600 hover:bg-pine-700"
        >
          Add Ingredient
        </button>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">Instructions</h3>
        {instructions.map((instruction) => (
          <div key={instruction.id} className="mt-2">
            <div className="flex items-start gap-2">
              <span className="mt-2 text-gray-500">{instruction.step}.</span>
              <textarea
                value={instruction.description}
                onChange={(e) => updateInstruction(instruction.id, e.target.value)}
                placeholder="Instruction step"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-pine-600 focus:ring-pine-600"
                rows={2}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addInstruction}
          className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-pine-600 hover:bg-pine-700"
        >
          Add Instruction
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700">Prep Time (minutes)</label>
          <input
            type="number"
            id="prepTime"
            value={prepTime}
            onChange={(e) => setPrepTime(parseInt(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pine-600 focus:ring-pine-600"
            min="0"
            required
          />
        </div>
        <div>
          <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700">Cook Time (minutes)</label>
          <input
            type="number"
            id="cookTime"
            value={cookTime}
            onChange={(e) => setCookTime(parseInt(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pine-600 focus:ring-pine-600"
            min="0"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="servings" className="block text-sm font-medium text-gray-700">Servings</label>
          <input
            type="number"
            id="servings"
            value={servings}
            onChange={(e) => setServings(parseInt(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pine-600 focus:ring-pine-600"
            min="1"
            required
          />
        </div>
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">Difficulty</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Recipe['difficulty'])}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pine-600 focus:ring-pine-600"
            required
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="url"
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pine-600 focus:ring-pine-600"
        />
      </div>

      <div>
        <button
          type="submit"
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pine-600 hover:bg-pine-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pine-500"
        >
          Add Recipe
        </button>
      </div>
    </form>
  );
} 