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
import { compact, sortBy } from "lodash";
import { Link } from "react-router-dom";
import { RecipeData, TimeData } from "../types";
import { ReactNode } from "react";

interface TimesProps {
  loading: boolean;
  recipe?: RecipeData;
}

const useStyles = createStyles(() => ({
  titleLink: {
    padding: "0.25rem 0.5rem",
  },
}));

function formatTime(time: TimeData): ReactNode[] {
  const category = <Text component="span">{time.category} &mdash;</Text>;

  const days = time.days && (
    <Text component="span" ml="0.3rem">
      {time.days}d
    </Text>
  );

  const hours = time.hours && (
    <Text component="span" ml="0.3rem">
      {time.hours}h
    </Text>
  );

  const minutes = time.minutes && (
    <Text component="span" ml="0.3rem">
      {time.minutes}m
    </Text>
  );

  const note = time.note && (
    <Text color="dimmed" component="span" ml="0.5rem">
      {time.note}
    </Text>
  );
  return compact([category, days, hours, minutes, note]);
}

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
        {loading && <Skeleton height={30} />}

        {!loading && (
          <>
            {!recipe?.times?.length && (
              <Text color="dimmed">No times have been created yet.</Text>
            )}

            {recipe?.times?.length && (
              <List>
                {sortBy(recipe.times, "category").map((t) => (
                  <List.Item key={t.id}>{formatTime(t)}</List.Item>
                ))}
              </List>
            )}
          </>
        )}
      </Box>
    </>
  );
}

export default Times;
