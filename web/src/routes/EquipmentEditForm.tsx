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
  Modal,
  Skeleton,
  Text,
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
import { ApiResponse, useApi } from "../hooks/useApi";
import { useEffect, useRef, useState } from "react";
import { useForm } from "@mantine/form";
import { omit, pick } from "lodash";
import { useDebouncedFunction } from "../hooks/useDebouncedFunction";

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

export default function EquipmentEditForm() {
  const [alert, setAlert] = useState<string | undefined>(undefined);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [deleteAlert, setDeleteAlert] = useState<string | undefined>(undefined);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [equipmentMatches, setEquipmentMatches] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const shouldLoad = useRef<boolean>(true);
  const { classes } = useStyles();
  const { get, getRouteFn, post } = useApi();

  const { recipeId, equipmentId } = useParams() as {
    recipeId: string;
    equipmentId: string;
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
        const routeFn = getRouteFn("equipment");
        const response = await get({ url: routeFn(equipmentId) });
        setLoading(false);

        if (handledApiError(response, { setAlert })) {
          return;
        }

        setFieldValue("description", response.data.description);
      })();
    }
  });

  const searchEquipment = useDebouncedFunction(200, (value: string) =>
    get({ url: getRouteFn("equipmentSearch")(value) })
  ) as (value: string) => Promise<ApiResponse> | undefined;

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Edit Equipment")}</title>
      </Helmet>

      <Navbar />

      <Modal
        centered={true}
        onClose={() => setConfirmDelete(false)}
        opened={confirmDelete}
        padding="sm"
        title="Delete Equipment"
      >
        <Box className={classes.formWrapper}>
          <LoadingOverlay visible={deleting} />

          <Text component="p">
            Are you sure you want to delete this equipment from this recipe?
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
              const routeFn = getRouteFn("equipmentDissociate");
              const response = await post({
                url: routeFn(recipeId, equipmentId),
              });
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

            <Anchor
              component={Link}
              to={`/recipe/${recipeId}/equipment/${equipmentId}/edit`}
            >
              Equipment
            </Anchor>
          </Breadcrumbs>

          <Title order={1} mt="md">
            Edit Equipment
          </Title>

          {loading ? (
            <>
              <Skeleton height={20} mt="md" width={75} />
              <Skeleton height={30} mt="0.5rem" />
            </>
          ) : (
            <Box className={classes.formWrapper}>
              <LoadingOverlay visible={submitting} />

              <form
                onSubmit={onSubmit(async (values) => {
                  setSubmitting(true);
                  const routeFn = getRouteFn("equipmentUpdate");

                  const response = await post({
                    data: pick(values, ["description"]),
                    url: routeFn(equipmentId),
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
                  data={equipmentMatches}
                  disabled={submitting}
                  label="Description"
                  mt="md"
                  onChange={async (value: string) => {
                    getInputProps("description").onChange(value);
                    const response = await searchEquipment(value);
                    setEquipmentMatches(response?.data?.matches || []);
                  }}
                  {...omit(getInputProps("description"), "onChange")}
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
                    type="button"
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
