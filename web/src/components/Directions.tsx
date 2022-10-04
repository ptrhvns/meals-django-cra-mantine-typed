import RecipeSection from "./RecipeSection";
import RecipeSectionHeader from "./RecipeSectionHeader";
import RecipeSectionTitle from "./RecipeSectionTitle";
import { Anchor, createStyles } from "@mantine/core";
import { Link } from "react-router-dom";
import { RecipeData } from "../types";

interface DirectionsProps {
  loading: boolean;
  recipe?: RecipeData;
}

const useStyles = createStyles(() => ({
  titleLink: {
    padding: "0.25rem 0.5rem",
  },
}));

export default function Directions({ loading, recipe }: DirectionsProps) {
  const { classes } = useStyles();

  return (
    <RecipeSection>
      <RecipeSectionHeader>
        <RecipeSectionTitle title="Directions" />

        {recipe && (
          <Anchor
            className={classes.titleLink}
            component={Link}
            title="Create direction"
            to={`/recipe/${recipe.id}/directions/new`}
          >
            Create
          </Anchor>
        )}
      </RecipeSectionHeader>
    </RecipeSection>
  );
}
