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
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { buildTitle, handledApiError } from "../lib/utils";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { useApi } from "../hooks/useApi";
import { pick } from "lodash";

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

function NotesEditForm() {
  const [alert, setAlert] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { classes } = useStyles();
  const { getRouteFn, post } = useApi();
  const { recipeId } = useParams() as { recipeId: string };

  const { getInputProps, onSubmit, setFieldError } = useForm({
    initialValues: {},
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Edit Notes")}</title>
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

            <Anchor component={Link} to={`/recipe/${recipeId}/notes/edit`}>
              Notes
            </Anchor>
          </Breadcrumbs>

          <Title order={1} mt="md">
            Edit Notes
          </Title>

          <Box className={classes.formWrapper}>
            <LoadingOverlay visible={submitting} />

            <form
              onSubmit={onSubmit(async (values) => {
                setSubmitting(true);
                const routeFn = getRouteFn("notesUpdate");

                const response = await post({
                  data: pick(values, ["notes"]),
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

              <Textarea
                autosize
                disabled={submitting}
                label="Notes"
                minRows={5}
                mt="md"
                {...getInputProps("notes")}
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

export default NotesEditForm;
