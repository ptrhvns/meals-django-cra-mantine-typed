import RecipeSection from "./RecipeSection";
import RecipeSectionHeader from "./RecipeSectionHeader";
import RecipeSectionTitle from "./RecipeSectionTitle";
import { Anchor, Box, createStyles, Skeleton, Text } from "@mantine/core";
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

      <Box mt="0.25rem">
        {loading ? (
          <Skeleton height={60} />
        ) : (
          <>
            {recipe?.notes ? (
              <Text>{recipe.notes}</Text>
            ) : (
              <Text color="dimmed">Notes haven't been set yet.</Text>
            )}
          </>
        )}
      </Box>
    </RecipeSection>
  );
}

export default Notes;
