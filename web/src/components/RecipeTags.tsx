import {
  Anchor,
  Box,
  createStyles,
  Divider,
  Skeleton,
  Title,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { RecipeType } from "../types";

interface RecipeTagProps {
  isLoading: boolean;
  recipe?: RecipeType;
}

const TITLE_SIZE = "1.25rem";

const useStyles = createStyles((theme) => ({
  title: {
    color: theme.fn.darken(theme.colors.yellow[9], 0.25),
    fontSize: TITLE_SIZE,
  },
  tagLink: {
    padding: "0.25rem 0.5rem",
  },
  titleWrapper: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

function RecipeTags({ isLoading, recipe }: RecipeTagProps) {
  const { classes } = useStyles();

  if (recipe) {
    return (
      <>
        <Divider mt="md" pt="md" />

        <Box className={classes.titleWrapper}>
          <Title className={classes.title} order={3}>
            Tags
          </Title>

          <Anchor
            className={classes.tagLink}
            component={Link}
            title="Create tag"
            to={`/recipe/${recipe.id}/tag/new`}
          >
            Create
          </Anchor>
        </Box>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Divider mt="md" pt="md" />
        <Skeleton height={TITLE_SIZE} />;
      </>
    );
  }

  return null;
}

export default RecipeTags;
