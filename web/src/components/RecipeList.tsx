import {
  Alert,
  Anchor,
  Box,
  Button,
  List,
  Skeleton,
  Text,
  Title,
} from "@mantine/core";
import {
  faCircleExclamation,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { useEffect, useRef, useState } from "react";

interface Recipe {
  id: string;
  title: string;
}

function RecipeList() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [recipes, setRecipes] = useState<Recipe[] | undefined>([]);
  const shouldLoad = useRef<boolean>(true);
  const { get } = useApi();

  useEffect(() => {
    if (shouldLoad.current) {
      (async () => {
        shouldLoad.current = false;
        const response = await get({ route: "recipes" });
        setIsLoading(false);

        if (response.isError) {
          setError(response.message);
          return;
        }

        setRecipes(response?.data?.recipes);
      })();
    }
  });

  return (
    <>
      <Title order={2}>Recipes</Title>

      <Button component={Link} mt="xl" to="/recipe/new">
        <FontAwesomeIcon icon={faPlusCircle} />
        <Text ml="xs">Create recipe</Text>
      </Button>

      {error && (
        <Alert
          color="red"
          icon={<FontAwesomeIcon icon={faCircleExclamation} />}
          mt="xl"
          onClose={() => setError(undefined)}
          withCloseButton
        >
          <Box mr="xl">
            We could not get the list of your recipes: "{error}"
          </Box>
        </Alert>
      )}

      {isLoading && (
        <Box mt="xl">
          <Skeleton height={16} radius="xl" />
          <Skeleton height={16} mt="sm" radius="xl" />
          <Skeleton height={16} mt="sm" radius="xl" />
        </Box>
      )}

      {!isLoading && !error && isEmpty(recipes) && (
        <Text color="dimmed" component="p" mt="xl">
          No recipes have been created yet.
        </Text>
      )}

      {!isLoading && !error && !isEmpty(recipes) && (
        <Box mt="xl">
          {/* TODO handle pagination (next_page and previous_page) */}
          <List>
            {recipes?.map((recipe) => (
              <List.Item key={recipe.id}>
                <Anchor component={Link} to={`/recipe/${recipe.id}`}>
                  {recipe.title}
                </Anchor>
              </List.Item>
            ))}
          </List>
        </Box>
      )}
    </>
  );
}

export default RecipeList;
