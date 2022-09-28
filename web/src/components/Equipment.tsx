import RecipeSection from "./RecipeSection";
import RecipeSectionHeader from "./RecipeSectionHeader";
import RecipeSectionTitle from "./RecipeSectionTitle";
import { Anchor, createStyles } from "@mantine/core";
import { Link } from "react-router-dom";
import { RecipeData } from "../types";

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
    </RecipeSection>
  );
}

export default Equipment;
