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
import { sortBy } from "lodash";

interface RecipeTagProps {
  loading: boolean;
  recipe?: RecipeData;
}

const useStyles = createStyles(() => ({
  badge: {
    cursor: "pointer",

    "&:hover": {
      textDecoration: "underline",
    },
  },
  titleLink: {
    padding: "0.25rem 0.5rem",
  },
  tagWrapper: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
}));

function Tags({ loading, recipe }: RecipeTagProps) {
  const { classes } = useStyles();

  return (
    <>
      <Divider mt="md" pt="md" />

      <RecipeSectionHeader>
        <RecipeSectionTitle title="Tags" />

        {recipe && (
          <Anchor
            className={classes.titleLink}
            component={Link}
            title="Create tag"
            to={`/recipe/${recipe.id}/tag/new`}
          >
            Create
          </Anchor>
        )}
      </RecipeSectionHeader>

      <Box mt="sm">
        {loading ? (
          <Skeleton height={20} />
        ) : (
          <>
            {recipe?.tags?.length ? (
              <Box className={classes.tagWrapper}>
                {sortBy(recipe.tags, "name").map((tag) => (
                  <Anchor
                    key={tag.id}
                    component={Link}
                    to={`/recipe/${recipe.id}/tag/${tag.id}/edit`}
                  >
                    <Badge className={classes.badge}>{tag.name}</Badge>
                  </Anchor>
                ))}
              </Box>
            ) : (
              <Text color="dimmed">No tags have been created yet.</Text>
            )}
          </>
        )}
      </Box>
    </>
  );
}

export default Tags;
