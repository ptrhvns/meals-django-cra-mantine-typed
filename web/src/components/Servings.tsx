import RecipeSectionHeader from "./RecipeSectionHeader";
import RecipeSectionTitle from "./RecipeSectionTitle";
import {
  Anchor,
  Badge,
  Box,
  createStyles,
  Divider,
  Skeleton,
  Text,
} from "@mantine/core";
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
  const servings = parseFloat(recipe?.servings || "0");

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

      <Box mt="sm">
        {loading ? (
          <Skeleton height={30} />
        ) : (
          <>
            {recipe?.servings ? (
              <Badge color="gray.7" size="md">
                {Math.floor(servings) === servings
                  ? Math.floor(servings)
                  : servings}
              </Badge>
            ) : (
              <Text color="dimmed">Servings hasn't been set yet.</Text>
            )}
          </>
        )}
      </Box>
    </>
  );
}

export default Servings;
