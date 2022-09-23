import { Anchor, Box, createStyles, Skeleton, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import { RecipeData } from "../types";

interface RecipeTitleProps {
  loading: boolean;
  recipe?: RecipeData;
}

const TITLE_SIZE = "1.5rem";

const useStyles = createStyles(() => ({
  title: {
    fontSize: TITLE_SIZE,
    fontWeight: 500,
  },
  titleLink: {
    padding: "0.25rem 0.5rem",
  },
  titleWrapper: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

function RecipeTitle({ loading, recipe }: RecipeTitleProps) {
  const { classes } = useStyles();

  if (recipe) {
    return (
      <Box className={classes.titleWrapper} mt="1.25rem">
        <Title className={classes.title} order={2}>
          {recipe.title}
        </Title>

        <Anchor
          className={classes.titleLink}
          component={Link}
          title="Edit title"
          to={`/recipe/${recipe.id}/title/edit`}
        >
          Edit
        </Anchor>
      </Box>
    );
  }

  if (loading) {
    return <Skeleton height={TITLE_SIZE} radius="md" />;
  }

  return null;
}

export default RecipeTitle;
