import RecipeSection from "./RecipeSection";
import RecipeSectionHeader from "./RecipeSectionHeader";
import RecipeSectionTitle from "./RecipeSectionTitle";
import { Anchor, createStyles } from "@mantine/core";
import { Link } from "react-router-dom";
import { RecipeData } from "../types";

interface NotesProps {
  loading: boolean;
  recipe?: RecipeData;
}

const useStyles = createStyles(() => ({
  titleLink: {
    padding: "0.25rem 0.5rem",
  },
}));

function Notes({ loading, recipe }: NotesProps) {
  const { classes } = useStyles();

  return (
    <RecipeSection>
      <RecipeSectionHeader>
        <RecipeSectionTitle title="Notes" />

        {recipe && (
          <Anchor
            className={classes.titleLink}
            component={Link}
            title="Edit notes"
            to={`/recipe/${recipe.id}/notes/edit`}
          >
            Edit
          </Anchor>
        )}
      </RecipeSectionHeader>
    </RecipeSection>
  );
}

export default Notes;
