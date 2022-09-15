import {
  Anchor,
  Badge,
  Box,
  createStyles,
  Divider,
  Skeleton,
  Text,
  Title,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { sortBy } from "lodash";

interface RecipeTagProps {
  loading: boolean;
  recipe?: {
    id: string;
    tags?: { id: number; name: string }[];
  };
}

const TITLE_SIZE = "1.25rem";

const useStyles = createStyles((theme) => ({
  badge: {
    cursor: "pointer",

    "&:hover": {
      textDecoration: "underline",
    },
  },
  title: {
    color: theme.fn.darken(theme.colors.yellow[9], 0.25),
    fontSize: TITLE_SIZE,
  },
  tagLink: {
    padding: "0.25rem 0.5rem",
  },
  tagWrapper: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  titleWrapper: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

function Tags({ loading, recipe }: RecipeTagProps) {
  const { classes } = useStyles();

  return (
    <>
      <Divider mt="md" pt="md" />

      <Box className={classes.titleWrapper}>
        <Title className={classes.title} order={3}>
          Tags
        </Title>

        {recipe && (
          <Anchor
            className={classes.tagLink}
            component={Link}
            title="Create tag"
            to={`/recipe/${recipe.id}/tag/new`}
          >
            Create
          </Anchor>
        )}
      </Box>

      <Box mt="sm">
        {loading && <Skeleton height={TITLE_SIZE} />}

        {!loading && (
          <>
            {!recipe?.tags?.length && (
              <Text color="dimmed">No tags have been created yet.</Text>
            )}

            {recipe?.tags?.length && (
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
            )}
          </>
        )}
      </Box>
    </>
  );
}

export default Tags;
