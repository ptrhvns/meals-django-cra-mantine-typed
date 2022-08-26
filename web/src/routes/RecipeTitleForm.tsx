import Navbar from "../components/Navbar";
import RequireAuthn from "../components/RequireAuthn";
import {
  Alert,
  Anchor,
  Box,
  Breadcrumbs,
  Button,
  Container,
  createStyles,
  LoadingOverlay,
  Skeleton,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { buildTitle } from "../lib/utils/dom";
import {
  faCircleExclamation,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forOwn, head, pick } from "lodash";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { useEffect, useRef, useState } from "react";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles(() => ({
  formWrapper: {
    position: "relative",
  },
  titleInput: {
    maxWidth: "40rem",
  },
}));

function RecipeTitleForm() {
  const [alert, setAlert] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const shouldLoad = useRef<boolean>(true);
  const { classes } = useStyles();
  const { get, getRouteFn, post } = useApi();
  const { recipeId } = useParams() as { recipeId: string };

  const form = useForm({
    initialValues: {
      title: "",
    },
  });

  useEffect(() => {
    if (shouldLoad.current) {
      (async () => {
        shouldLoad.current = false;
        const response = await get({ url: getRouteFn("recipe")({ recipeId }) });
        setLoading(false);

        if (response.isError) {
          setAlert(response.message);
          return;
        }

        form.setFieldValue("title", response.data?.title);
      })();
    }
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Edit Recipe Title")}</title>
      </Helmet>

      <Navbar />

      <Container>
        <Box mt="xl">
          <Breadcrumbs>
            <Anchor component={Link} to="/dashboard">
              Dashboard
            </Anchor>

            <Anchor component={Link} to={`/recipe/${recipeId}`}>
              Recipe
            </Anchor>

            <Anchor component={Link} to={`/recipe/${recipeId}/title/edit`}>
              Title
            </Anchor>
          </Breadcrumbs>

          <Title order={1} mt="md">
            Edit Recipe Title
          </Title>

          {loading && (
            <>
              <Skeleton height={21.7} mt="md" width={25} />
              <Skeleton height={36} mt="0.25rem" width={560} />
            </>
          )}

          {!loading && (
            <Box className={classes.formWrapper}>
              <LoadingOverlay visible={submitting} />

              <form
                onSubmit={form.onSubmit(async (values) => {
                  setSubmitting(true);

                  const response = await post({
                    data: pick(values, ["title"]),
                    url: getRouteFn("recipeTitleUpdate")({ recipeId }),
                  });

                  setSubmitting(false);

                  if (response.isError) {
                    setAlert(response.message);

                    forOwn(response.errors, (value, key) =>
                      form.setFieldError(key, head(value))
                    );

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

                <TextInput
                  className={classes.titleInput}
                  disabled={submitting}
                  label="Title"
                  mt="md"
                  {...form.getInputProps("title")}
                />

                <Button disabled={submitting} mt="xl" type="submit">
                  <FontAwesomeIcon icon={faCirclePlus} />
                  <Text ml="xs">Save</Text>
                </Button>
              </form>
            </Box>
          )}
        </Box>
      </Container>
    </RequireAuthn>
  );
}

export default RecipeTitleForm;
