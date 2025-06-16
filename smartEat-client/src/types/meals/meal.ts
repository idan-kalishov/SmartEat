import { Ingredient } from '../common';

export interface Meal {
  id: string;
  userId: string;
  createdAt: string; // ISO date string
  name: string;
  ingredients: Ingredient[];
  imageUrl?: string; // URL to the meal image
} 