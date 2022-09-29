export interface EquipmentData {
  description: string;
  id: number;
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
  notes: string | null;
  rating: number | null;
  servings: string | null;
  tags: TagData[] | null;
  times: TimeData[] | null;
  title: string;
}
