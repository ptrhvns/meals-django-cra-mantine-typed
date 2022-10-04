import RecipeSection from "./RecipeSection";
import RecipeSectionHeader from "./RecipeSectionHeader";
import RecipeSectionTitle from "./RecipeSectionTitle";
import { Anchor, Box, createStyles, List, Skeleton, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import { RecipeData } from "../types";
import { compact, join } from "lodash";

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

      <Box mt="0.25rem">
        {loading ? (
          <>
            <Skeleton height={20} />
            <Skeleton height={20} mt="sm" />
            <Skeleton height={20} mt="sm" />
          </>
        ) : (
          <>
            {recipe?.ingredients?.length ? (
              <List>
                {recipe.ingredients.map((ingredient) => (
                  <List.Item key={ingredient.id}>
                    <Anchor
                      component={Link}
                      to={`/recipe/${recipe.id}/ingredient/${ingredient.id}/edit`}
                    >
                      {join(
                        compact([
                          ingredient.amount,
                          ingredient?.unit?.name,
                          ingredient?.brand?.name,
                          ingredient?.food?.name,
                        ]),
                        " "
                      )}
                    </Anchor>
                  </List.Item>
                ))}
              </List>
            ) : (
              <Text color="dimmed">No ingredients yet.</Text>
            )}
          </>
        )}
      </Box>
    </RecipeSection>
  );
}

export default Ingredients;
