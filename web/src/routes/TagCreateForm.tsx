import Navbar from "../components/Navbar";
import PageLayout from "../components/PageLayout";
import RequireAuthn from "../components/RequireAuthn";
import {
  Alert,
  Anchor,
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
  createStyles,
  LoadingOverlay,
  Text,
  Title,
} from "@mantine/core";
import { buildTitle } from "../lib/utils/dom";
import {
  faCircleExclamation,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { ApiResponse, useApi } from "../hooks/useApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handledApiError } from "../lib/utils/api";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { omit, pick } from "lodash";
import { useDebouncedFunction } from "../hooks/useDebouncedFunction";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

function TagCreateForm() {
  const [alert, setAlert] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [tagMatches, setTagMatches] = useState<string[]>([]);
  const navigate = useNavigate();
  const { classes } = useStyles();
  const { get, getRouteFn, post } = useApi();
  const { recipeId } = useParams() as { recipeId: string };

  const { onSubmit, setFieldError, getInputProps } = useForm({
    initialValues: {
      name: "",
    },
  });

  const searchTags = useDebouncedFunction(200, (value: string) =>
    get({
      url: getRouteFn("tagSearch")({ searchTerm: value }),
    })
  ) as (value: string) => Promise<ApiResponse> | undefined;

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("New Tag")}</title>
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

            <Anchor component={Link} to={`/recipe/${recipeId}/tag/new`}>
              Tag
            </Anchor>
          </Breadcrumbs>

          <Title order={1} mt="md">
            New Tag
          </Title>

          <Box className={classes.formWrapper}>
            <LoadingOverlay visible={submitting} />

            <form
              onSubmit={onSubmit(async (values) => {
                setSubmitting(true);
                const routeFn = getRouteFn("tagAssociate");

                const response = await post({
                  data: pick(values, ["name"]),
                  url: routeFn({ recipeId }),
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

              <Autocomplete
                data={tagMatches}
                disabled={submitting}
                label="Name"
                mt="md"
                onChange={async (value: string) => {
                  getInputProps("name").onChange(value);
                  const response = await searchTags(value);
                  setTagMatches(response?.data?.matches || []);
                }}
                {...omit(getInputProps("name"), "onChange")}
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
        </Box>
      </PageLayout>
    </RequireAuthn>
  );
}

export default TagCreateForm;
