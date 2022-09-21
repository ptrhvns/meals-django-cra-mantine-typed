import RecipeSectionHeader from "./RecipeSectionHeader";
import RecipeSectionTitle from "./RecipeSectionTitle";
import { Anchor, createStyles, Divider } from "@mantine/core";
import { Link } from "react-router-dom";
import { RecipeData } from "../types";

interface ServingsProps {
  loading: boolean;
  recipe?: RecipeData;
}

const useStyles = createStyles(() => ({
  titleLink: {
    padding: "0.25rem 0.5rem",
  },
}));

function Servings({ loading, recipe }: ServingsProps) {
  const { classes } = useStyles();

  return (
    <>
      <Divider mt="md" pt="md" />

      <RecipeSectionHeader>
        <RecipeSectionTitle title="Servings" />

        {recipe && (
          <Anchor
            className={classes.titleLink}
            component={Link}
            title="Edit servings"
            to={`/recipe/${recipe.id}/servings/edit`}
          >
            Edit
          </Anchor>
        )}
      </RecipeSectionHeader>
    </>
  );
}

export default Servings;
