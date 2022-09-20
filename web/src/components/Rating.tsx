import RecipeSectionHeader from "./RecipeSectionHeader";
import RecipeSectionTitle from "./RecipeSectionTitle";
import {
  Anchor,
  Box,
  createStyles,
  Divider,
  Skeleton,
  Text,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { Rating as ReactRating } from "@smastrom/react-rating";
import { RecipeData } from "../types";

interface RatingProps {
  loading: boolean;
  recipe?: RecipeData;
}

const useStyles = createStyles((theme) => ({
  rating: {
    maxWidth: "8rem",
  },
  ratingText: {
    fontSize: theme.fontSizes.lg,
  },
  ratingWrapper: {
    display: "flex",
    gap: "0.5rem",
  },
  titleLink: {
    padding: "0.25rem 0.5rem",
  },
}));

function Rating({ loading, recipe }: RatingProps) {
  const { classes } = useStyles();

  return (
    <>
      <Divider mt="md" pt="md" />

      <RecipeSectionHeader>
        <RecipeSectionTitle title="Rating" />

        {recipe && (
          <Anchor
            className={classes.titleLink}
            component={Link}
            title="Edit rating"
            to={`/recipe/${recipe.id}/rating/edit`}
          >
            Edit
          </Anchor>
        )}
      </RecipeSectionHeader>

      <Box mt="sm">
        {loading ? (
          <Skeleton height={30} />
        ) : (
          <>
            {recipe?.rating ? (
              <Box className={classes.ratingWrapper}>
                <ReactRating
                  className={classes.rating}
                  readOnly
                  value={recipe?.rating || 0}
                />
                <Text className={classes.ratingText} color="dimmed">
                  ({recipe?.rating || 0})
                </Text>
              </Box>
            ) : (
              <Text color="dimmed">A rating hasn't been set yet.</Text>
            )}
          </>
        )}
      </Box>
    </>
  );
}

export default Rating;
