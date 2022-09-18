import RecipeSectionHeader from "./RecipeSectionHeader";
import RecipeSectionTitle from "./RecipeSectionTitle";
import { Anchor, createStyles, Divider } from "@mantine/core";
import { Link } from "react-router-dom";

interface TimesProps {
  loading: boolean;
  recipe?: {
    id: string;
  };
}

const useStyles = createStyles(() => ({
  titleLink: {
    padding: "0.25rem 0.5rem",
  },
}));

function Times({ loading, recipe }: TimesProps) {
  const { classes } = useStyles();

  return (
    <>
      <Divider mt="md" pt="md" />

      <RecipeSectionHeader>
        <RecipeSectionTitle title="Times" />

        {recipe && (
          <Anchor
            className={classes.titleLink}
            component={Link}
            title="Create time"
            to={`/recipe/${recipe.id}/time/new`}
          >
            Create
          </Anchor>
        )}
      </RecipeSectionHeader>
    </>
  );
}

export default Times;
