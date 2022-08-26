import {
  Alert,
  Anchor,
  Box,
  Button,
  Pagination,
  Skeleton,
  Table,
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
import { useCallback, useEffect, useRef, useState } from "react";

interface PaginationType {
  page: number;
  total: number;
}

interface RecipeType {
  id: string;
  title: string;
}

function RecipeList() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationType | undefined>(
    undefined
  );
  const [recipes, setRecipes] = useState<RecipeType[] | undefined>([]);
  const shouldLoad = useRef<boolean>(true);
  const { get, getRouteFn } = useApi();

  const getRecipes = useCallback(
    async (page: number = 1) => {
      setIsLoading(true);

      const response = await get({
        url: getRouteFn("recipes")({ page }),
      });

      setIsLoading(false);

      if (response.isError) {
        setError(response.message);
        return;
      }

      setPagination(response.data?.pagination);
      setRecipes(response.data?.recipes);
    },
    [get, getRouteFn]
  );

  useEffect(() => {
    if (shouldLoad.current) {
      getRecipes();
    }
  }, [getRecipes]);

  return (
    <>
      <Title order={2}>Recipes</Title>

      <Button component={Link} mt="md" to="/recipe/new">
        <FontAwesomeIcon icon={faPlusCircle} />
        <Text ml="xs">Create recipe</Text>
      </Button>

      {error && (
        <Alert
          color="red"
          icon={<FontAwesomeIcon icon={faCircleExclamation} />}
          mt="md"
          onClose={() => setError(undefined)}
          withCloseButton
        >
          <Box mr="xl">
            We could not get the list of your recipes: "{error}"
          </Box>
        </Alert>
      )}

      {isLoading && (
        <Box mt="md">
          <Skeleton height={42.7} radius="sm" />
          <Skeleton height={42.7} mt="sm" radius="sm" />
          <Skeleton height={42.7} mt="sm" radius="sm" />
          <Skeleton height={42.7} mt="sm" radius="sm" />
        </Box>
      )}

      {!isLoading && !error && isEmpty(recipes) && (
        <Text color="dimmed" component="p" mt="md">
          No recipes have been created yet.
        </Text>
      )}

      {!isLoading && !error && !isEmpty(recipes) && (
        <Box mt="md">
          <Table striped verticalSpacing="xs">
            <thead>
              <tr>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              {recipes?.map((recipe) => (
                <tr key={recipe.id}>
                  <td>
                    <Anchor component={Link} to={`/recipe/${recipe.id}`}>
                      {recipe.title}
                    </Anchor>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {pagination && pagination.total > 1 && (
            <Pagination
              mt="md"
              onChange={getRecipes}
              page={pagination.page}
              total={pagination.total}
            />
          )}
        </Box>
      )}
    </>
  );
}

export default RecipeList;
