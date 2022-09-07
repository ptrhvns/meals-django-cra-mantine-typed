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
import { handledApiError } from "../lib/utils/api";
import { handledInvalidData } from "../lib/utils/validation";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { pick } from "lodash";
import { stringifyValue } from "../lib/utils/json";
import { useApi } from "../hooks/useApi";
import { useEffect, useRef, useState } from "react";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";

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
  pageLayout: {
    maxWidth: "35rem",
  },
}));

interface RecipeData {
  id: string;
  title: string;
}

const schema: JTDSchemaType<RecipeData> = {
  additionalProperties: true,
  properties: {
    id: { type: "string" },
    title: { type: "string" },
  },
};

const validate = new Ajv().compile(schema);

function RecipeTitleForm() {
  const [alert, setAlert] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const shouldLoad = useRef<boolean>(true);
  const { classes } = useStyles();
  const { get, getRouteFn, post } = useApi();
  const { recipeId } = useParams() as { recipeId: string };

  const { getInputProps, onSubmit, setFieldError, setFieldValue } = useForm({
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

        if (handledApiError(response, { setAlert })) {
          return;
        }

        const data = stringifyValue(response.data, "id");

        if (handledInvalidData<RecipeData>(validate, data, setAlert)) {
          return;
        }

        setFieldValue("title", response.data.title);
      })();
    }
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Edit Recipe Title")}</title>
      </Helmet>

      <Navbar />

      <PageLayout containerClassName={classes.pageLayout}>
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
                onSubmit={onSubmit(async (values) => {
                  setSubmitting(true);

                  const response = await post({
                    data: pick(values, ["title"]),
                    url: getRouteFn("recipeTitleUpdate")({ recipeId }),
                  });

                  setSubmitting(false);

                  if (handledApiError(response, { setAlert, setFieldError })) {
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
                  disabled={submitting}
                  label="Title"
                  mt="md"
                  {...getInputProps("title")}
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
          )}
        </Box>
      </PageLayout>
    </RequireAuthn>
  );
}

export default RecipeTitleForm;
