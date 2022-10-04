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
  TextInput,
  Title,
} from "@mantine/core";
import { ApiResponse, useApi } from "../hooks/useApi";
import { buildTitle, handledApiError } from "../lib/utils";
import {
  faCircleExclamation,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { omit, pick } from "lodash";
import { useDebouncedFunction } from "../hooks/useDebouncedFunction";
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

export default function IngredientCreateForm() {
  const [alert, setAlert] = useState<string | undefined>(undefined);
  const [brandMatches, setBrandMatches] = useState<string[]>([]);
  const [foodMatches, setFoodMatches] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [unitMatches, setUnitMatches] = useState<string[]>([]);
  const navigate = useNavigate();
  const { classes } = useStyles();
  const { get, getRouteFn, post } = useApi();
  const { recipeId } = useParams() as { recipeId: string };

  const { getInputProps, onSubmit, setFieldError } = useForm({
    initialValues: {
      amount: "",
      brand: "",
      food: "",
      unit: "",
    },
  });

  const searchUnit = useDebouncedFunction(200, (value: string) =>
    get({ url: getRouteFn("unitSearch")(value) })
  ) as (value: string) => Promise<ApiResponse> | undefined;

  const searchBrand = useDebouncedFunction(200, (value: string) =>
    get({ url: getRouteFn("brandSearch")(value) })
  ) as (value: string) => Promise<ApiResponse> | undefined;

  const searchFood = useDebouncedFunction(200, (value: string) =>
    get({ url: getRouteFn("foodSearch")(value) })
  ) as (value: string) => Promise<ApiResponse> | undefined;

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("New Ingredient")}</title>
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

            <Anchor component={Link} to={`/recipe/${recipeId}/ingredients/new`}>
              Ingredient
            </Anchor>
          </Breadcrumbs>

          <Title order={1} mt="md">
            New Ingredient
          </Title>

          <Box className={classes.formWrapper}>
            <LoadingOverlay visible={submitting} />

            <form
              onSubmit={onSubmit(async (values) => {
                setSubmitting(true);
                const routeFn = getRouteFn("ingredientAssociate");

                const response = await post({
                  data: pick(values, ["amount", "brand", "food", "unit"]),
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

              <TextInput
                disabled={submitting}
                label="Amount"
                mt="md"
                {...getInputProps("amount")}
              />

              <Autocomplete
                data={unitMatches}
                disabled={submitting}
                label="Unit"
                mt="md"
                onChange={async (value: string) => {
                  getInputProps("unit").onChange(value);
                  const response = await searchUnit(value);
                  setUnitMatches(response?.data?.matches || []);
                }}
                {...omit(getInputProps("unit"), "onChange")}
              />

              <Autocomplete
                data={brandMatches}
                disabled={submitting}
                label="Brand"
                mt="md"
                onChange={async (value: string) => {
                  getInputProps("brand").onChange(value);
                  const response = await searchBrand(value);
                  setBrandMatches(response?.data?.matches || []);
                }}
                {...omit(getInputProps("brand"), "onChange")}
              />

              <Autocomplete
                data={foodMatches}
                disabled={submitting}
                label="Food"
                mt="md"
                onChange={async (value: string) => {
                  getInputProps("food").onChange(value);
                  const response = await searchFood(value);
                  setFoodMatches(response?.data?.matches || []);
                }}
                {...omit(getInputProps("food"), "onChange")}
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
