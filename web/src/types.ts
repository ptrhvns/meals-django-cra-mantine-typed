export interface RecipeData {
  id: string;
  rating: number | null;
  tags: { id: string; name: string }[] | null;
  times:
    | {
        category: string;
        days: number | null;
        hours: number | null;
        id: string;
        minutes: number | null;
        note: string | null;
      }[]
    | null;
  title: string;
}
