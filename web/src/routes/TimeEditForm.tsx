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
  NativeSelect,
  SimpleGrid,
  Skeleton,
  Text,
  TextInput,
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
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { forOwn, pick } from "lodash";
import { TimeData } from "../types";
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
  pageLayout: {
    maxWidth: "35rem",
  },
}));

const timeDataSchema: JTDSchemaType<TimeData> = {
  additionalProperties: true,
  properties: {
    category: { type: "string" },
    days: { nullable: true, type: "uint16" },
    hours: { nullable: true, type: "uint16" },
    id: { type: "string" },
    minutes: { nullable: true, type: "uint16" },
    note: { nullable: true, type: "string" },
  },
};

const validateTimeData = new Ajv().compile(timeDataSchema);

function TimeEditForm() {
  const [alert, setAlert] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const shouldLoad = useRef<boolean>(true);
  const { classes } = useStyles();
  const { get, getRouteFn, post } = useApi();

  const { recipeId, timeId } = useParams() as {
    recipeId: string;
    timeId: string;
  };

  const { onSubmit, getInputProps, setFieldError, setFieldValue } = useForm({
    initialValues: {
      category: "",
      days: "",
      hours: "",
      minutes: "",
      note: "",
    },
  });

  useEffect(() => {
    if (shouldLoad.current) {
      (async () => {
        shouldLoad.current = false;
        const routeFn = getRouteFn("time");
        const response = await get({ url: routeFn(timeId) });
        setLoading(false);

        if (handledApiError(response, { setAlert })) {
          return;
        }

        stringifyIdsDeeply(response.data);

        if (
          handledInvalidData<TimeData>(
            validateTimeData,
            response.data,
            setAlert
          )
        ) {
          return;
        }

        forOwn(response.data, (value, key) => {
          setFieldValue(key, value ?? "");
        });
      })();
    }
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Edit Time")}</title>
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

            <Anchor
              component={Link}
              to={`/recipe/${recipeId}/time/${timeId}/edit`}
            >
              Time
            </Anchor>
          </Breadcrumbs>

          <Title order={1} mt="md">
            Edit Time
          </Title>

          <Box className={classes.formWrapper}>
            <LoadingOverlay visible={submitting} />

            <form
              onSubmit={onSubmit(async (values) => {
                setSubmitting(true);
                const routeFn = getRouteFn("timeUpdate");

                const response = await post({
                  data: pick(values, [
                    "category",
                    "days",
                    "hours",
                    "minutes",
                    "note",
                  ]),
                  url: routeFn(timeId),
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

              {loading && (
                <>
                  <Box mt="md">
                    <Skeleton height={20} width={55} />
                    <Skeleton height={35} mt="0.3rem" />
                  </Box>

                  <Box mt="md">
                    <Skeleton height={20} width={55} />
                    <Skeleton height={35} mt="0.3rem" />
                  </Box>

                  <Box mt="md">
                    <Skeleton height={20} width={55} />
                    <Skeleton height={35} mt="0.3rem" />
                  </Box>
                </>
              )}

              {!loading && (
                <>
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
                </>
              )}
            </form>
          </Box>
        </Box>
      </PageLayout>
    </RequireAuthn>
  );
}

export default TimeEditForm;
