import RecipeSection from "./RecipeSection";
import RecipeSectionHeader from "./RecipeSectionHeader";
import RecipeSectionTitle from "./RecipeSectionTitle";
import { Anchor, createStyles } from "@mantine/core";
import { Link } from "react-router-dom";
import { RecipeData } from "../types";

interface IngredientsProps {
  loading: boolean;
  recipe?: RecipeData;
}

const useStyles = createStyles(() => ({
  titleLink: {
    padding: "0.25rem 0.5rem",
  },
}));

function Ingredients({ loading, recipe }: IngredientsProps) {
  const { classes } = useStyles();

  return (
    <RecipeSection>
      <RecipeSectionHeader>
        <RecipeSectionTitle title="Ingredients" />

        {recipe && (
          <Anchor
            className={classes.titleLink}
            component={Link}
            title="Create ingredient"
            to={`/recipe/${recipe.id}/ingredients/new`}
          >
            Create
          </Anchor>
        )}
      </RecipeSectionHeader>
    </RecipeSection>
  );
}

export default Ingredients;
