export interface TimeData {
  category: string;
  days: number | null;
  hours: number | null;
  id: string;
  minutes: number | null;
  note: string | null;
}

export interface RecipeData {
  id: string;
  rating: number | null;
  servings: string | null;
  tags: { id: string; name: string }[] | null;
  times: TimeData[] | null;
  title: string;
}
