import { Anchor, Box, createStyles, Divider, Title } from "@mantine/core";
import { Link } from "react-router-dom";

interface TimesProps {
  loading: boolean;
  recipe?: {
    id: string;
  };
}

const TITLE_SIZE = "1.25rem";

const useStyles = createStyles((theme) => ({
  title: {
    color: theme.fn.darken(theme.colors.yellow[9], 0.25),
    fontSize: TITLE_SIZE,
  },
  titleLink: {
    padding: "0.25rem 0.5rem",
  },
  titleWrapper: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

function Times({ loading, recipe }: TimesProps) {
  const { classes } = useStyles();

  return (
    <>
      <Divider mt="md" pt="md" />

      <Box className={classes.titleWrapper}>
        <Title className={classes.title} order={3}>
          Times
        </Title>

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
      </Box>
    </>
  );
}

export default Times;
