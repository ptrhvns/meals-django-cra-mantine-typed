import RecipeSection from "./RecipeSection";
import RecipeSectionHeader from "./RecipeSectionHeader";
import RecipeSectionTitle from "./RecipeSectionTitle";
import { Anchor, Box, createStyles, List, Skeleton, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import { RecipeData } from "../types";
import { sortBy } from "lodash";

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

      <Box mt="0.25rem">
        {loading ? (
          <>
            <Skeleton height={20} />
            <Skeleton height={20} mt="sm" />
            <Skeleton height={20} mt="sm" />
          </>
        ) : (
          <>
            {recipe?.directions?.length ? (
              <>
                <List type="ordered">
                  {sortBy(recipe.directions, "order").map((direction) => (
                    <List.Item key={direction.id}>
                      <Anchor
                        component={Link}
                        to={`/recipe/${recipe.id}/direction/${direction.id}/edit`}
                      >
                        {direction.description}
                      </Anchor>
                    </List.Item>
                  ))}
                </List>
              </>
            ) : (
              <>
                <Text color="dimmed">No directions yet.</Text>
              </>
            )}
          </>
        )}
      </Box>
    </RecipeSection>
  );
}
