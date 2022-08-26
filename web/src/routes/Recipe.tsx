import Navbar from "../components/Navbar";
import PageLayout from "../components/PageLayout";
import RecipeTitle from "../components/RecipeTitle";
import RequireAuthn from "../components/RequireAuthn";
import {
  Alert,
  Anchor,
  Box,
  Breadcrumbs,
  Button,
  createStyles,
  Modal,
  Text,
} from "@mantine/core";
import { buildTitle } from "../lib/utils/dom";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { RecipeType } from "../types";
import { useApi } from "../hooks/useApi";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles(() => ({
  wrapper: {
    position: "relative",
  },
}));

function Recipe() {
  const [alert, setAlert] = useState<string | undefined>(undefined);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [confirmDeleteAlert, setConfirmDeleteAlert] = useState<
    string | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [recipe, setRecipe] = useState<RecipeType | undefined>(undefined);
  const navigate = useNavigate();
  const shouldLoad = useRef<boolean>(true);
  const { classes } = useStyles();
  const { get, getRouteFn, post } = useApi();
  const { recipeId } = useParams() as { recipeId: string };

  useEffect(() => {
    if (shouldLoad.current) {
      (async () => {
        shouldLoad.current = false;
        const response = await get({ url: getRouteFn("recipe")({ recipeId }) });
        setIsLoading(false);

        if (response.isError) {
          setAlert(response.message);
          return;
        }

        setRecipe(response.data);
      })();
    }
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Recipe")}</title>
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

        <Button
          color="red"
          onClick={async () => {
            const response = await post({
              url: getRouteFn("recipeDestroy")({ recipeId }),
            });

            if (response.isError) {
              setConfirmDeleteAlert(response.message);
              return;
            }

            navigate("/dashboard", { replace: true });
          }}
        >
          Delete recipe
        </Button>
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
            <RecipeTitle isLoading={isLoading} recipe={recipe} />
          </Box>

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
