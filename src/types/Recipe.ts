export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: Ingredient[];
  instructions: Instruction[];
  categories: string[];
  tags: string[];
  tips?: Tip[];
  substitutions?: Substitution[];
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  isPublished?: boolean;
  rating?: number;
  totalTime?: number;
  nutritionInfo?: NutritionInfo;
  imageUrl: string;
  userId: string;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  notes?: string;
  isOptional?: boolean;
}

export interface Instruction {
  id: string;
  step: number;
  description: string;
  image?: string;
  timingInMinutes?: number;
  isOptional?: boolean;
}

export interface Tip {
  text: string;
  category?: 'preparation' | 'cooking' | 'storage' | 'general';
}

export interface Substitution {
  ingredient: string;
  alternatives: Alternative[];
}

export interface Alternative {
  name: string;
  notes?: string;
  ratio?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  servingSize: string;
} 