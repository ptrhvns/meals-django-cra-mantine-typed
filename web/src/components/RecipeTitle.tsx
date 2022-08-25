import { createStyles, Skeleton, Title } from "@mantine/core";
import { RecipeType } from "../types";

interface RecipeTitleProps {
  isLoading: boolean;
  recipe?: RecipeType;
}

const TITLE_SIZE = "1.65rem";

const useStyles = createStyles(() => ({
  title: {
    fontSize: TITLE_SIZE,
  },
}));

function RecipeTitle({ isLoading, recipe }: RecipeTitleProps) {
  const { classes } = useStyles();

  if (recipe) {
    return (
      <Title className={classes.title} order={2}>
        {recipe.title}
      </Title>
    );
  }

  if (isLoading) {
    return <Skeleton height={TITLE_SIZE} radius="md" />;
  }

  return null;
}

export default RecipeTitle;
