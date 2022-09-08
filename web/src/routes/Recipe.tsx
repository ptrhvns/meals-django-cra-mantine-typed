import Ajv, { JTDSchemaType } from "ajv/dist/jtd";
import Navbar from "../components/Navbar";
import PageLayout from "../components/PageLayout";
import RecipeTitle from "../components/RecipeTitle";
import RequireAuthn from "../components/RequireAuthn";
import Tags from "../components/Tags";
import {
  Alert,
  Anchor,
  Box,
  Breadcrumbs,
  Button,
  createStyles,
  Divider,
  Modal,
  Text,
} from "@mantine/core";
import {
  buildTitle,
  handledApiError,
  handledInvalidData,
  stringifyIdsDeeply,
} from "../lib/utils";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles(() => ({
  modalActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    justifyContent: "space-between",
  },
  wrapper: {
    position: "relative",
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

function Recipe() {
  const [alert, setAlert] = useState<string | undefined>(undefined);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [confirmDeleteAlert, setConfirmDeleteAlert] = useState<
    string | undefined
  >(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [recipe, setRecipe] = useState<RecipeData | undefined>(undefined);
  const navigate = useNavigate();
  const shouldLoad = useRef<boolean>(true);
  const { classes } = useStyles();
  const { get, getRouteFn, post } = useApi();
  const { recipeId } = useParams() as { recipeId: string };

  useEffect(() => {
    if (shouldLoad.current) {
      (async () => {
        shouldLoad.current = false;
        const response = await get({ url: getRouteFn("recipe")(recipeId) });
        setLoading(false);

        if (handledApiError(response, { setAlert })) {
          return;
        }

        stringifyIdsDeeply(response.data);

        if (handledInvalidData<RecipeData>(validate, response.data, setAlert)) {
          return;
        }

        setRecipe(response.data);
      })();
    }
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle(recipe ? recipe.title : "Recipe")}</title>
      </Helmet>

      <Navbar />

      <Modal
        centered={true}
        onClose={() => setConfirmDelete(false)}
        opened={confirmDelete}
        padding="sm"
        title="Delete Recipe"
      >
        <Text component="p">Are you sure you want to delete this recipe?</Text>

        {confirmDeleteAlert && (
          <Alert
            color="red"
            icon={<FontAwesomeIcon icon={faCircleExclamation} />}
            mb="lg"
            onClose={() => setConfirmDeleteAlert(undefined)}
            withCloseButton
          >
            <Box mr="xl">{confirmDeleteAlert}</Box>
          </Alert>
        )}

        <Box className={classes.modalActions}>
          <Button
            color="red"
            onClick={async () => {
              const response = await post({
                url: getRouteFn("recipeDestroy")(recipeId),
              });

              if (
                handledApiError(response, { setAlert: setConfirmDeleteAlert })
              ) {
                return;
              }

              navigate("/dashboard", { replace: true });
            }}
          >
            Delete recipe
          </Button>

          <Button
            color="gray"
            onClick={() => setConfirmDelete(false)}
            variant="outline"
          >
            <Text>Dismiss</Text>
          </Button>
        </Box>
      </Modal>

      <PageLayout>
        <Box className={classes.wrapper}>
          <Breadcrumbs>
            <Anchor component={Link} to="/dashboard">
              Dashboard
            </Anchor>

            <Anchor component={Link} to={`/recipe/${recipeId}`}>
              Recipe
            </Anchor>
          </Breadcrumbs>

          {alert && (
            <Alert
              color="red"
              icon={<FontAwesomeIcon icon={faCircleExclamation} />}
              mt="xl"
              onClose={() => setAlert(undefined)}
              withCloseButton
            >
              <Box mr="xl">{alert}</Box>
            </Alert>
          )}

          <Box mt="md">
            <RecipeTitle loading={loading} recipe={recipe} />
            <Tags loading={loading} recipe={recipe} />
          </Box>

          <Divider mt="xl" />

          <Box mt="xl">
            <Button color="red" onClick={() => setConfirmDelete(true)}>
              Delete recipe
            </Button>
          </Box>
        </Box>
      </PageLayout>
    </RequireAuthn>
  );
}

export default Recipe;
