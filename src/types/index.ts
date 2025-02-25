// ไฟล์: src/types/index.ts
export interface Recipe {
    id: string;
    title: string;
    description: string;
    image: string;
    prepTime: number;
    cookTime: number;
    servings: number;
    difficulty: 'ง่าย' | 'ปานกลาง' | 'ยาก';
    ingredients: Ingredient[];
    instructions: string[];
    category: string;
    tags: string[];
    author: User;
    createdAt: string;
    rating: number;
    reviews: Review[];
  }
  
  export interface Ingredient {
    name: string;
    amount: number;
    unit: string;
  }
  
  export interface User {
    id: string;
    name: string;
    avatar: string;
  }
  
  export interface Review {
    id: string;
    user: User;
    rating: number;
    comment: string;
    createdAt: string;
  }