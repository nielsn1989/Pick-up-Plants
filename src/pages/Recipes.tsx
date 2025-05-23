import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Recipe {
  id: string;
  title: string;
  image: string;
  category: string;
  prepTime: string;
  difficulty: string;
}

const SAMPLE_RECIPES: Recipe[] = [
  {
    id: 'quinoa-bowl',
    title: 'Rainbow Quinoa Buddha Bowl',
    image: '/images/recipes/quinoa-bowl.jpg', // We'll add these images later
    category: 'Lunch',
    prepTime: '25 mins',
    difficulty: 'Easy'
  },
  {
    id: 'overnight-oats',
    title: 'Creamy Overnight Oats',
    image: '/images/recipes/overnight-oats.jpg',
    category: 'Breakfast',
    prepTime: '10 mins',
    difficulty: 'Easy'
  },
  {
    id: 'lentil-curry',
    title: 'Spiced Lentil Curry',
    image: '/images/recipes/lentil-curry.jpg',
    category: 'Dinner',
    prepTime: '35 mins',
    difficulty: 'Medium'
  },
  {
    id: 'smoothie-bowl',
    title: 'Berry Smoothie Bowl',
    image: '/images/recipes/smoothie-bowl.jpg',
    category: 'Breakfast',
    prepTime: '15 mins',
    difficulty: 'Easy'
  },
  {
    id: 'chickpea-salad',
    title: 'Mediterranean Chickpea Salad',
    image: '/images/recipes/chickpea-salad.jpg',
    category: 'Lunch',
    prepTime: '20 mins',
    difficulty: 'Easy'
  },
  {
    id: 'mushroom-pasta',
    title: 'Creamy Mushroom Pasta',
    image: '/images/recipes/mushroom-pasta.jpg',
    category: 'Dinner',
    prepTime: '30 mins',
    difficulty: 'Medium'
  }
];

const DEFAULT_IMAGE = '/images/recipes/default-recipe.jpg';

const RecipeImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative aspect-w-16 aspect-h-9 bg-primary-light/20">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={hasError ? DEFAULT_IMAGE : src}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-light/30 to-primary-dark/30"></div>
    </div>
  );
};

const RecipePage: React.FC = () => {
  return (
    <div className="bg-primary-dark min-h-screen pt-20 pb-12">
      {/* Page Header */}
      <div className="text-center py-12 px-4 bg-gradient-to-b from-primary to-primary-dark">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Plant-Based Recipes
        </h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto">
          Discover our collection of delicious plant-based recipes
        </p>
      </div>

      {/* Recipe Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SAMPLE_RECIPES.map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recipe/${recipe.id}`}
              className="group bg-primary rounded-lg overflow-hidden transform transition-transform hover:scale-102 hover:-translate-y-1"
            >
              <RecipeImage src={recipe.image} alt={recipe.title} />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-white/90">
                  {recipe.title}
                </h3>
                <div className="flex items-center space-x-4 text-white/70">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {recipe.category}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {recipe.prepTime}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {recipe.difficulty}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipePage; 