export interface RecipeType {
  id: number;
  tags?: { id: number; name: string }[];
  title: string;
}
