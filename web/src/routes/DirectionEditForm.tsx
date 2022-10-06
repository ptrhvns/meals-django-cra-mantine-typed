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
  Skeleton,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { buildTitle, handledApiError } from "../lib/utils";
import {
  faCircleExclamation,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { pick } from "lodash";
import { useApi } from "../hooks/useApi";
import { useEffect, useRef, useState } from "react";
import { useForm } from "@mantine/form";

const useStyles = createStyles(() => ({
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    justifyContent: "space-between",
  },
  formWrapper: {
    position: "relative",
  },
  modalActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    justifyContent: "space-between",
  },
  pageLayout: {
    maxWidth: "35rem",
  },
}));

export default function DirectionCreateForm() {
  const [alert, setAlert] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const shouldLoad = useRef<boolean>(true);
  const { classes } = useStyles();
  const { get, getRouteFn, post } = useApi();

  const { directionId, recipeId } = useParams() as {
    directionId: string;
    recipeId: string;
  };

  const { getInputProps, onSubmit, setFieldError, setFieldValue } = useForm({
    initialValues: {
      description: "",
    },
  });

  useEffect(() => {
    if (shouldLoad.current) {
      (async () => {
        shouldLoad.current = false;
        const routeFn = getRouteFn("direction");
        const response = await get({ url: routeFn(directionId) });
        setLoading(false);

        if (handledApiError(response, { setAlert })) {
          return;
        }

        setFieldValue("description", response.data?.description);
      })();
    }
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("New Direction")}</title>
      </Helmet>

      <Navbar />

      <PageLayout containerClassName={classes.pageLayout}>
        <Box my="md">
          <Breadcrumbs>
            <Anchor component={Link} to="/dashboard">
              Dashboard
            </Anchor>

            <Anchor component={Link} to={`/recipe/${recipeId}`}>
              Recipe
            </Anchor>

            <Anchor component={Link} to={`/recipe/${recipeId}/directions/new`}>
              Direction
            </Anchor>
          </Breadcrumbs>

          <Title order={1} mt="md">
            New Direction
          </Title>

          {loading ? (
            <>
              <Skeleton height={20} mt="md" width={75} />
              <Skeleton height={60} mt="0.5rem" />
            </>
          ) : (
            <>
              <Box className={classes.formWrapper}>
                <LoadingOverlay visible={submitting} />

                <form
                  onSubmit={onSubmit(async (values) => {
                    setSubmitting(true);
                    const routeFn = getRouteFn("directionUpdate");

                    const response = await post({
                      data: pick(values, ["description"]),
                      url: routeFn(directionId),
                    });

                    setSubmitting(false);

                    if (
                      handledApiError(response, { setAlert, setFieldError })
                    ) {
                      return;
                    }

                    navigate(`/recipe/${recipeId}`, { replace: true });
                  })}
                >
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

                  <Textarea
                    autosize
                    disabled={submitting}
                    label="Description"
                    minRows={2}
                    mt="md"
                    {...getInputProps("description")}
                  />

                  <Box className={classes.actions} mt="xl">
                    <Button disabled={submitting} type="submit">
                      <FontAwesomeIcon icon={faCirclePlus} />
                      <Text ml="xs">Save</Text>
                    </Button>

                    <Button
                      color="gray"
                      disabled={submitting}
                      onClick={() => navigate(`/recipe/${recipeId}`)}
                      variant="outline"
                    >
                      <Text>Dismiss</Text>
                    </Button>
                  </Box>
                </form>
              </Box>
            </>
          )}
        </Box>
      </PageLayout>
    </RequireAuthn>
  );
}
