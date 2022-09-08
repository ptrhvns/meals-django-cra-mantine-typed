import Ajv, { JTDSchemaType } from "ajv/dist/jtd";
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
import {
  handledApiError,
  handledInvalidData,
  stringifyIdsDeeply,
} from "../lib/utils";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { useCallback, useEffect, useRef, useState } from "react";

interface PaginationData {
  page: number;
  total: number;
}

interface RecipeData {
  id: string;
  title: string;
}

interface RecipesData {
  pagination: PaginationData;
  recipes: RecipeData[];
}

const schema: JTDSchemaType<RecipesData> = {
  additionalProperties: true,
  properties: {
    pagination: {
      properties: {
        page: { type: "uint32" },
        total: { type: "uint32" },
      },
    },
    recipes: {
      elements: {
        properties: {
          id: { type: "string" },
          title: { type: "string" },
        },
      },
    },
  },
};

const validate = new Ajv().compile(schema);

function RecipeList() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationData | undefined>(
    undefined
  );
  const [recipes, setRecipes] = useState<RecipeData[] | undefined>([]);
  const shouldLoad = useRef<boolean>(true);
  const { get, getRouteFn } = useApi();

  const getRecipes = useCallback(
    async (page: number = 1) => {
      setLoading(true);

      const response = await get({
        url: getRouteFn("recipes")(page),
      });

      setLoading(false);

      if (handledApiError(response, { setAlert: setError })) {
        return;
      }

      stringifyIdsDeeply(response.data);

      if (handledInvalidData<RecipesData>(validate, response.data, setError)) {
        return;
      }

      setPagination(response.data.pagination);
      setRecipes(response.data.recipes);
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

      {loading && (
        <Box mt="md">
          <Skeleton height={42.7} radius="sm" />
          <Skeleton height={42.7} mt="sm" radius="sm" />
          <Skeleton height={42.7} mt="sm" radius="sm" />
          <Skeleton height={42.7} mt="sm" radius="sm" />
        </Box>
      )}

      {!loading && !error && isEmpty(recipes) && (
        <Text color="dimmed" component="p" mt="md">
          No recipes have been created yet.
        </Text>
      )}

      {!loading && !error && !isEmpty(recipes) && (
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
