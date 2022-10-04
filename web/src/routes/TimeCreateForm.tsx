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
  NativeSelect,
  SimpleGrid,
  Text,
  TextInput,
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
import { useForm } from "@mantine/form";
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

export default function TimeCreateForm() {
  const [alert, setAlert] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { classes } = useStyles();
  const { getRouteFn, post } = useApi();
  const { recipeId } = useParams() as { recipeId: string };

  const { getInputProps, onSubmit, setFieldError } = useForm({
    initialValues: {
      category: "",
      days: "",
      hours: "",
      minutes: "",
      note: "",
    },
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("New Time")}</title>
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

            <Anchor component={Link} to={`/recipe/${recipeId}/time/new`}>
              Time
            </Anchor>
          </Breadcrumbs>

          <Title order={1} mt="md">
            New Time
          </Title>

          <Box className={classes.formWrapper}>
            <LoadingOverlay visible={submitting} />

            <form
              onSubmit={onSubmit(async (values) => {
                setSubmitting(true);
                const routeFn = getRouteFn("timeCreate");

                const response = await post({
                  data: pick(values, [
                    "category",
                    "days",
                    "hours",
                    "minutes",
                    "note",
                  ]),
                  url: routeFn(recipeId),
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

              <NativeSelect
                data={[
                  { value: "", label: "-- Select a category --" },
                  "Additional",
                  "Cook",
                  "Preparation",
                  "Total",
                ]}
                disabled={submitting}
                label="Category"
                mt="md"
                {...getInputProps("category")}
              />

              <SimpleGrid cols={3} mt="md">
                <TextInput
                  disabled={submitting}
                  label="Days"
                  {...getInputProps("days")}
                />
                <TextInput
                  disabled={submitting}
                  label="Hours"
                  {...getInputProps("hours")}
                />
                <TextInput
                  disabled={submitting}
                  label="Minutes"
                  {...getInputProps("minutes")}
                />
              </SimpleGrid>

              <TextInput
                disabled={submitting}
                label="Note"
                mt="md"
                {...getInputProps("note")}
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
