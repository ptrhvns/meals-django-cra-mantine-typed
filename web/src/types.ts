export interface EquipmentData {
  description: string;
  id: number;
}

export interface BrandData {
  id: number;
  name: string;
}

export interface FoodData {
  id: number;
  name: string;
}

export interface UnitData {
  id: number;
  name: string;
}

export interface IngredientData {
  amount: number | null;
  brand: BrandData | null;
  food: FoodData;
  id: number;
  unit: UnitData | null;
}

export interface TagData {
  id: number;
  name: string;
}

export interface TimeData {
  category: string;
  days: number | null;
  hours: number | null;
  id: number;
  minutes: number | null;
  note: string | null;
}

export interface RecipeData {
  equipment: EquipmentData[] | null;
  id: number;
  ingredients: IngredientData[] | null;
  notes: string | null;
  rating: number | null;
  servings: string | null;
  tags: TagData[] | null;
  times: TimeData[] | null;
  title: string;
}
