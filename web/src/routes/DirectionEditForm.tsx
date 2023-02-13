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
  NativeSelect,
  Skeleton,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { buildTitle, handledApiError } from "../lib/utils";
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
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [deleteAlert, setDeleteAlert] = useState<string | undefined>(undefined);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [maxOrder, setMaxOrder] = useState<number | undefined>(undefined);
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
      order: "",
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
        setFieldValue("order", response.data?.order);
        setMaxOrder(response.data?.max_order);
      })();
    }
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("New Direction")}</title>
      </Helmet>

      <Navbar />

      <Modal
        centered={true}
        onClose={() => setConfirmDelete(false)}
        opened={confirmDelete}
        padding="sm"
        title="Delete Direction"
      >
        <Box className={classes.formWrapper}>
          <LoadingOverlay visible={deleting} />

          <Text component="p">
            Are you sure you want to delete this direction from this recipe?
          </Text>

          {deleteAlert && (
            <Alert
              color="red"
              icon={<FontAwesomeIcon icon={faCircleExclamation} />}
              mb="lg"
              onClose={() => setDeleteAlert(undefined)}
              withCloseButton
            >
              <Box mr="xl">{deleteAlert}</Box>
            </Alert>
          )}
        </Box>

        <Box className={classes.modalActions}>
          <Button
            color="red"
            disabled={deleting}
            onClick={async () => {
              setDeleting(true);
              const routeFn = getRouteFn("directionDestroy");
              const response = await post({ url: routeFn(directionId) });
              setDeleting(false);

              if (handledApiError(response, { setAlert: setDeleteAlert })) {
                return;
              }

              navigate(`/recipe/${recipeId}`, { replace: true });
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
            <Text ml="xs">Delete</Text>
          </Button>

          <Button
            color="gray"
            onClick={() => {
              setConfirmDelete(false);
              setDeleteAlert(undefined);
            }}
            variant="outline"
          >
            <Text>Dismiss</Text>
          </Button>
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

                  <NativeSelect
                    data={[
                      ...Array.from(Array(maxOrder || 0).keys(), (n) =>
                        (n + 1).toString()
                      ),
                    ]}
                    disabled={submitting}
                    label="Order"
                    mt="md"
                    {...getInputProps("order")}
                  />

                  <Box className={classes.actions} mt="xl">
                    <Button disabled={submitting} type="submit">
                      <FontAwesomeIcon icon={faCirclePlus} />
                      <Text ml="xs">Save</Text>
                    </Button>

                    <Button
                      color="red"
                      disabled={submitting}
                      onClick={() => setConfirmDelete(true)}
                      type="button"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      <Text ml="xs">Delete</Text>
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
