import {
  Anchor,
  Box,
  createStyles,
  Divider,
  Skeleton,
  Text,
  Title,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { Rating as ReactRating } from "@smastrom/react-rating";

interface RatingProps {
  loading: boolean;
  recipe?: {
    id: string;
    rating: number | null;
  };
}

const RATING_WIDTH = "8rem";
const TITLE_SIZE = "1.25rem";

const useStyles = createStyles((theme) => ({
  rating: {
    maxWidth: RATING_WIDTH,
  },
  ratingText: {
    fontSize: theme.fontSizes.lg,
  },
  ratingWrapper: {
    display: "flex",
    gap: "0.5rem",
  },
  tagLink: {
    padding: "0.25rem 0.5rem",
  },
  title: {
    color: theme.fn.darken(theme.colors.yellow[9], 0.25),
    fontSize: TITLE_SIZE,
  },
  titleWrapper: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

function Rating({ loading, recipe }: RatingProps) {
  const { classes } = useStyles();

  return (
    <>
      <Divider mt="md" pt="md" />

      <Box className={classes.titleWrapper}>
        <Title className={classes.title} order={3}>
          Rating
        </Title>

        {recipe && (
          <Anchor
            className={classes.tagLink}
            component={Link}
            title="Edit rating"
            to={`/recipe/${recipe.id}/rating/edit`}
          >
            Edit
          </Anchor>
        )}
      </Box>

      <Box mt="sm">
        {loading && <Skeleton height={TITLE_SIZE} width={RATING_WIDTH} />}

        {!loading && (
          <>
            {!recipe?.rating && (
              <Text color="dimmed">A rating hasn't been set yet.</Text>
            )}

            {recipe?.rating && (
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
            )}
          </>
        )}
      </Box>
    </>
  );
}

export default Rating;
