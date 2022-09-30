import RecipeSection from "./RecipeSection";
import RecipeSectionHeader from "./RecipeSectionHeader";
import RecipeSectionTitle from "./RecipeSectionTitle";
import { Anchor, Box, createStyles, List, Skeleton, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import { RecipeData } from "../types";
import { sortBy } from "lodash";

interface EquipmentProps {
  loading: boolean;
  recipe?: RecipeData;
}

const useStyles = createStyles(() => ({
  titleLink: {
    padding: "0.25rem 0.5rem",
  },
}));

function Equipment({ loading, recipe }: EquipmentProps) {
  const { classes } = useStyles();

  return (
    <RecipeSection>
      <RecipeSectionHeader>
        <RecipeSectionTitle title="Equipment" />

        {recipe && (
          <Anchor
            className={classes.titleLink}
            component={Link}
            title="Create equipment"
            to={`/recipe/${recipe.id}/equipment/new`}
          >
            Create
          </Anchor>
        )}
      </RecipeSectionHeader>

      <Box mt="0.25rem">
        {loading ? (
          <>
            <Skeleton height={20} />
            <Skeleton height={20} mt="sm" />
            <Skeleton height={20} mt="sm" />
          </>
        ) : (
          <>
            {recipe?.equipment?.length ? (
              <>
                <List>
                  {sortBy(recipe.equipment, "description").map((equipment) => (
                    <List.Item key={equipment.id}>
                      <Anchor
                        component={Link}
                        to={`/recipe/${recipe.id}/equipment/${equipment.id}/edit`}
                      >
                        {equipment.description}
                      </Anchor>
                    </List.Item>
                  ))}
                </List>
              </>
            ) : (
              <Text color="dimmed">No equipment yet.</Text>
            )}
          </>
        )}
      </Box>
    </RecipeSection>
  );
}

export default Equipment;
