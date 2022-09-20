import Ajv, { JTDSchemaType } from "ajv/dist/jtd";
import Navbar from "../components/Navbar";
import PageLayout from "../components/PageLayout";
import RequireAuthn from "../components/RequireAuthn";
import {
  Alert,
  Anchor,
  Box,
  Breadcrumbs,
  Button,
  createStyles,
  LoadingOverlay,
  Modal,
  Skeleton,
  Text,
  Title,
} from "@mantine/core";
import {
  buildTitle,
  handledApiError,
  handledInvalidData,
  stringifyIdsDeeply,
} from "../lib/utils";
import {
  faCircleExclamation,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Rating as ReactRating } from "@smastrom/react-rating";
import { ReactNode } from "react";
import { useApi } from "../hooks/useApi";
import { useEffect, useRef, useState } from "react";

interface RatingData {
  rating: number | null;
}

const ratingDataSchema: JTDSchemaType<RatingData> = {
  additionalProperties: true,
  properties: {
    rating: { nullable: true, type: "uint8" },
  },
};

const validateRatingData = new Ajv().compile(ratingDataSchema);

const RATING_WIDTH = "10rem";

const useStyles = createStyles((theme) => ({
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    justifyContent: "space-between",
  },
  modalActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    justifyContent: "space-between",
  },
  overlayWrapper: {
    position: "relative",
  },
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
  skeleton: {
    maxWidth: "180px",
    width: "100%",
  },
}));

function RatingEditForm() {
  const [alert, setAlert] = useState<string | undefined>(undefined);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [ratingError, setRatingError] = useState<ReactNode | undefined>(
    undefined
  );
  const [resetAlert, setResetAlert] = useState<string | undefined>(undefined);
  const [resetting, setResetting] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const shouldLoad = useRef<boolean>(true);
  const { classes, cx } = useStyles();
  const { get, getRouteFn } = useApi();
  const { post } = useApi();
  const { recipeId } = useParams() as { recipeId: string };

  useEffect(() => {
    if (shouldLoad.current) {
      (async () => {
        shouldLoad.current = false;
        const routeFn = getRouteFn("rating");
        const response = await get({ url: routeFn(recipeId) });
        setLoading(false);

        if (handledApiError(response, { setAlert })) {
          return;
        }

        stringifyIdsDeeply(response.data);

        if (
          handledInvalidData<RatingData>(
            validateRatingData,
            response.data,
            setAlert
          )
        ) {
          return;
        }

        setRating(response.data.rating);
      })();
    }
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Edit Rating")}</title>
      </Helmet>

      <Navbar />

      <Modal
        centered={true}
        onClose={() => setConfirmReset(false)}
        opened={confirmReset}
        padding="sm"
        title="Reset Rating"
      >
        <Box className={classes.overlayWrapper}>
          <LoadingOverlay visible={resetting} />

          <Text component="p">Are you sure you want to reset the rating?</Text>

          {resetAlert && (
            <Alert
              color="red"
              icon={<FontAwesomeIcon icon={faCircleExclamation} />}
              mb="lg"
              onClose={() => setResetAlert(undefined)}
              withCloseButton
            >
              <Box mr="xl">{resetAlert}</Box>
            </Alert>
          )}

          <Box className={classes.modalActions}>
            <Button
              color="red"
              disabled={resetting}
              onClick={async () => {
                setResetting(true);
                const routeFn = getRouteFn("ratingDestroy");
                const response = await post({ url: routeFn(recipeId) });
                setResetting(false);

                if (handledApiError(response, { setAlert: setResetAlert })) {
                  return;
                }

                navigate(`/recipe/${recipeId}`, { replace: true });
              }}
            >
              <FontAwesomeIcon icon={faTrash} />
              <Text ml="xs">Reset</Text>
            </Button>

            <Button
              color="gray"
              onClick={() => {
                setConfirmReset(false);
                setResetAlert(undefined);
              }}
              variant="outline"
            >
              <Text>Dismiss</Text>
            </Button>
          </Box>
        </Box>
      </Modal>

      <PageLayout>
        <Box my="md">
          <Breadcrumbs>
            <Anchor component={Link} to="/dashboard">
              Dashboard
            </Anchor>

            <Anchor component={Link} to={`/recipe/${recipeId}`}>
              Recipe
            </Anchor>

            <Anchor component={Link} to={`/recipe/${recipeId}/rating/edit`}>
              Rating
            </Anchor>
          </Breadcrumbs>

          <Title order={1} mt="md">
            Edit Rating
          </Title>

          <Box mt="xl">
            {alert && (
              <Alert
                color="red"
                icon={<FontAwesomeIcon icon={faCircleExclamation} />}
                mt="md"
                onClose={() => setAlert(undefined)}
                withCloseButton
              >
                <Box mr="xl">{alert}</Box>
              </Alert>
            )}
          </Box>

          <Box
            className={cx(classes.ratingWrapper, classes.overlayWrapper)}
            mt="xl"
          >
            {loading ? (
              <Skeleton className={classes.skeleton} height={30} />
            ) : (
              <>
                <LoadingOverlay visible={submitting} />

                <ReactRating
                  className={classes.rating}
                  onChange={async (value) => {
                    setSubmitting(true);
                    const routeFn = getRouteFn("ratingUpdate");

                    const response = await post({
                      data: { rating: value },
                      url: routeFn(recipeId),
                    });

                    setSubmitting(false);

                    if (
                      handledApiError(response, {
                        setAlert,
                        setFieldError: (
                          path: string,
                          error: ReactNode
                        ): void => {
                          if ("rating" === path) {
                            setRatingError(error);
                          }
                        },
                      })
                    ) {
                      return;
                    }

                    navigate(`/recipe/${recipeId}`, { replace: true });
                  }}
                  value={rating || 0}
                />
                <Text className={classes.ratingText} color="dimmed">
                  ({rating || 0})
                </Text>
              </>
            )}
          </Box>

          {ratingError && (
            <Text color="red" mt="0.5rem">
              {ratingError}
            </Text>
          )}

          <Box className={classes.actions} mt="xl">
            <Button
              color="red"
              disabled={submitting}
              onClick={() => setConfirmReset(true)}
              type="button"
            >
              <FontAwesomeIcon icon={faTrash} />
              <Text ml="xs">Reset</Text>
            </Button>

            <Button
              color="gray"
              disabled={submitting}
              onClick={() => navigate(`/recipe/${recipeId}`)}
              variant="outline"
              type="button"
            >
              <Text>Dismiss</Text>
            </Button>
          </Box>
        </Box>
      </PageLayout>
    </RequireAuthn>
  );
}

export default RatingEditForm;
