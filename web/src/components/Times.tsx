import RecipeSectionHeader from "./RecipeSectionHeader";
import RecipeSectionTitle from "./RecipeSectionTitle";
import {
  Anchor,
  Box,
  createStyles,
  Divider,
  List,
  Skeleton,
  Text,
} from "@mantine/core";
import { sortBy } from "lodash";
import { Link } from "react-router-dom";
import { RecipeData } from "../types";

interface TimesProps {
  loading: boolean;
  recipe?: RecipeData;
}

const useStyles = createStyles(() => ({
  timeUnits: {
    display: "inline-flex",
    gap: "0.25rem",
  },
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

      <Box mt="sm">
        {loading ? (
          <Skeleton height={30} />
        ) : (
          <>
            {recipe?.times?.length ? (
              <List listStyleType="none" withPadding={false}>
                {sortBy(recipe.times, "category").map((t) => (
                  <List.Item key={t.id}>
                    <Text component="span" italic>
                      {t.category}
                    </Text>
                    <Anchor
                      className={classes.timeUnits}
                      component={Link}
                      ml="xs"
                      to={`/recipe/${recipe.id}/time/${t.id}/edit`}
                    >
                      {t.days && <Text component="span">{t.days}d</Text>}
                      {t.hours && <Text component="span">{t.hours}h</Text>}
                      {t.minutes && <Text component="span">{t.minutes}m</Text>}
                    </Anchor>
                    {t.note && (
                      <Text color="dimmed" component="span" ml="xs">
                        {t.note}
                      </Text>
                    )}
                  </List.Item>
                ))}
              </List>
            ) : (
              <Text color="dimmed">No times have been created yet.</Text>
            )}
          </>
        )}
      </Box>
    </>
  );
}

export default Times;
