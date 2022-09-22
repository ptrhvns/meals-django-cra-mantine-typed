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
  NumberInput,
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
  faCirclePlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { pick } from "lodash";
import { useApi } from "../hooks/useApi";
import { useEffect, useRef, useState } from "react";
import { useForm } from "@mantine/form";

interface ServingsData {
  servings: string | null;
}

const servingsDataSchema: JTDSchemaType<ServingsData> = {
  additionalProperties: true,
  properties: {
    servings: { nullable: true, type: "string" },
  },
};

const validateServingsData = new Ajv().compile(servingsDataSchema);

const useStyles = createStyles(() => ({
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
  pageLayout: {
    maxWidth: "35rem",
  },
}));

function ServingsEditForm() {
  const [alert, setAlert] = useState<string | undefined>(undefined);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [resetAlert, setResetAlert] = useState<string | undefined>(undefined);
  const [resetting, setResetting] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const shouldLoad = useRef<boolean>(true);
  const { classes } = useStyles();
  const { get, getRouteFn, post } = useApi();
  const { recipeId } = useParams() as { recipeId: string };

  const { getInputProps, onSubmit, setFieldError, setFieldValue } = useForm({
    initialValues: {
      servings: 0.0,
    },
  });

  useEffect(() => {
    if (shouldLoad.current) {
      (async () => {
        shouldLoad.current = false;
        const routeFn = getRouteFn("servings");
        const response = await get({ url: routeFn(recipeId) });
        setLoading(false);

        if (handledApiError(response, { setAlert })) {
          return;
        }

        stringifyIdsDeeply(response.data);

        if (
          handledInvalidData<ServingsData>(
            validateServingsData,
            response.data,
            setAlert
          )
        ) {
          return;
        }

        setFieldValue("servings", parseFloat(response.data.servings ?? "0"));
      })();
    }
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Edit Servings")}</title>
      </Helmet>

      <Navbar />

      <Modal
        centered={true}
        onClose={() => setConfirmReset(false)}
        opened={confirmReset}
        padding="sm"
        title="Reset Servings"
      >
        <Box className={classes.overlayWrapper}>
          <LoadingOverlay visible={resetting} />

          <Text component="p">Are you sure you want to reset servings?</Text>

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
                const routeFn = getRouteFn("servingsDestroy");
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

      <PageLayout containerClassName={classes.pageLayout}>
        <Box my="md">
          <Breadcrumbs>
            <Anchor component={Link} to="/dashboard">
              Dashboard
            </Anchor>

            <Anchor component={Link} to={`/recipe/${recipeId}`}>
              Recipe
            </Anchor>

            <Anchor component={Link} to={`/recipe/${recipeId}/servings/edit`}>
              Servings
            </Anchor>
          </Breadcrumbs>

          <Title order={1} mt="md">
            Edit Servings
          </Title>

          {loading ? (
            <Box mt="md">
              <Skeleton height={20} width={55} />
              <Skeleton height={35} mt="0.3rem" />
            </Box>
          ) : (
            <Box className={classes.overlayWrapper}>
              <LoadingOverlay visible={submitting} />

              <form
                onSubmit={onSubmit(async (values) => {
                  setSubmitting(true);
                  const routeFn = getRouteFn("servingsUpdate");

                  const response = await post({
                    data: pick(values, ["servings"]),
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

                <NumberInput
                  disabled={submitting}
                  label="Servings"
                  min={0}
                  mt="md"
                  precision={2}
                  startValue={1}
                  step={1}
                  {...getInputProps("servings")}
                />

                <Box className={classes.actions} mt="xl">
                  <Button disabled={submitting} type="submit">
                    <FontAwesomeIcon icon={faCirclePlus} />
                    <Text ml="xs">Save</Text>
                  </Button>

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

export default ServingsEditForm;
