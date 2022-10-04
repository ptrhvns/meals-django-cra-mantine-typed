import RecipeSection from "./RecipeSection";
import RecipeSectionHeader from "./RecipeSectionHeader";
import RecipeSectionTitle from "./RecipeSectionTitle";
import { Anchor, Box, createStyles, List, Skeleton, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import { RecipeData } from "../types";
import { sortBy } from "lodash";

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

export default function Times({ loading, recipe }: TimesProps) {
  const { classes } = useStyles();

  return (
    <RecipeSection>
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

      <Box mt="0.25rem">
        {loading ? (
          <Skeleton height={30} />
        ) : (
          <>
            {recipe?.times?.length ? (
              <List>
                {sortBy(recipe.times, "category").map((t) => (
                  <List.Item key={t.id}>
                    <Anchor
                      className={classes.timeUnits}
                      component={Link}
                      mx="0.25rem"
                      to={`/recipe/${recipe.id}/time/${t.id}/edit`}
                    >
                      {t.category}:
                      {t.days && <Text component="span">{t.days}d</Text>}
                      {t.hours && <Text component="span">{t.hours}h</Text>}
                      {t.minutes && <Text component="span">{t.minutes}m</Text>}
                      {t.note && <Text component="span">({t.note})</Text>}
                    </Anchor>
                  </List.Item>
                ))}
              </List>
            ) : (
              <Text color="dimmed">No times yet.</Text>
            )}
          </>
        )}
      </Box>
    </RecipeSection>
  );
}
