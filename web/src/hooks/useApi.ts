import Cookies from "js-cookie";
import useAuthn from "./useAuthn";
import { isEmpty, omit } from "lodash";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * This helper function ensures that TypeScript can infer the type of the keys
 * of the object literal passed to it (the route dictionary) as a union of all
 * of the string literal keys themselves. This will help users of the route
 * dictionary to avoid accessing the dictionary with invalid keys when used with
 * the getRouteFn() function.
 *
 */
const asRouteDictionary = <T>(dictionary: {
  [K in keyof T]: T[K];
}) => dictionary;

// prettier-ignore
const API_ROUTES = asRouteDictionary({
  csrfToken: () => "/api/csrf_token/",
  login: () => "/api/login/",
  logout: () => "/api/logout/",
  notesUpdate: (recipeId: string) => `/api/notes/${recipeId}/update/`,
  rating: (recipeId: string ) => `/api/rating/${recipeId}/`,
  ratingDestroy: (recipeId: string) => `/api/rating/${recipeId}/destroy/`,
  ratingUpdate: (recipeId: string) => `/api/rating/${recipeId}/update/`,
  recipe: (recipeId: string) => `/api/recipe/${recipeId}/`,
  recipeCreate: () => "/api/recipe/create/",
  recipeDestroy: (recipeId : string) => `/api/recipe/${recipeId}/destroy/`,
  recipes: (page: number) => `/api/recipes/?page=${page}`,
  recipeTitleUpdate: (recipeId: string) => `/api/recipe_title/${recipeId}/update/`,
  servings: (recipeId: string) => `/api/servings/${recipeId}/`,
  servingsDestroy: (recipeId: string) => `/api/servings/${recipeId}/destroy/`,
  servingsUpdate: (recipeId: string) => `/api/servings/${recipeId}/update/`,
  signup: () => "/api/signup/",
  signupConfirmation: () => "/api/signup_confirmation/",
  tag: (tagId: string) => `/api/tag/${tagId}/`,
  tagAssociate: (recipeId: string ) => `/api/tag/recipe/${recipeId}/associate/`,
  tagDissociate: (recipeId: string, tagId: string) => `/api/tag/${tagId}/recipe/${recipeId}/dissociate/`,
  tagSearch: (searchTerm: string) => `/api/tag/search/?search_term=${encodeURI(searchTerm)}`,
  tagUpdate: (tagId: string) => `/api/tag/${tagId}/update/`,
  time: (timeId: string) => `/api/time/${timeId}/`,
  timeCreate: (recipeId: string) => `/api/recipe/${recipeId}/time/create/`,
  timeDestroy: (timeId: string) => `/api/time/${timeId}/destroy/`,
  timeUpdate: (timeId: string) => `/api/time/${timeId}/update/`,
});

type ApiRoutes = typeof API_ROUTES;
type ApiRouteKeys = keyof typeof API_ROUTES;

/**
 * This function helps the caller avoid accessing the API route dictionary with
 * an invalid route key.
 *
 * @template K - converts the routeKey into a type
 * @param {K} routeKey - the string key to access the API route dictionary
 * @returns {ApiRoutes[K]} the route function associated with the routeKey
 */
function getRouteFn<K extends ApiRouteKeys>(routeKey: K): ApiRoutes[K] {
  return API_ROUTES[routeKey];
}

// prettier-ignore
const WEB_ROUTES = asRouteDictionary({
 login: () => '/login'
});

interface ApiArguments {
  data?: object;
  headers_init?: object;
  method: string;
  url: string;
}

export interface ApiResponse {
  data?: any;
  errors?: { [key: string]: string[] };
  isError?: boolean;
  message?: string;
}

interface UseApiReturn {
  get: (args: Omit<ApiArguments, "method">) => Promise<ApiResponse>;
  getRouteFn: typeof getRouteFn;
  post: (args: Omit<ApiArguments, "method">) => Promise<ApiResponse>;
  send: (args: ApiArguments) => Promise<ApiResponse>;
}

const DEFAULT_HEADERS_INIT = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

async function getJson(res: Response): Promise<object> {
  const text = await res.text();
  return isEmpty(text) ? {} : await JSON.parse(text);
}

export function useApi(): UseApiReturn {
  const navigate = useNavigate();
  const { logout } = useAuthn();

  const send = useCallback(
    async ({
      data,
      headers_init,
      method,
      url,
    }: ApiArguments): Promise<ApiResponse> => {
      let body: string | null;

      try {
        body = data ? JSON.stringify(data) : null;
      } catch (error) {
        console.error("Request could not be properly formatted:", error);
        return {
          isError: true,
          message: "Your request could not be properly formatted.",
        };
      }

      const headers = new Headers({
        ...DEFAULT_HEADERS_INIT,
        ...headers_init,
      });

      const mode = "same-origin";

      let response: Response;

      try {
        response = await fetch(url, { body, headers, method, mode });
      } catch (error) {
        console.error("Request could not be sent:", error);
        return {
          isError: true,
          message: "Your request could not be sent.",
        };
      }

      if (
        !response.ok &&
        (response.status === 401 || response.status === 403)
      ) {
        logout(() => navigate(WEB_ROUTES.login()));
        return {
          isError: true,
          message: "Your request was not authorized. Try logging in.",
        };
      }

      let json: { message?: string } = {};

      if (!response.ok) {
        try {
          json = await getJson(response);
        } catch (error) {
          json = {};
        }

        return {
          isError: true,
          message: json.message ?? "The response to your request was an error.",
          ...omit(json, "message"),
        };
      }

      try {
        json = await getJson(response);
      } catch (error) {
        console.error("Response was in an invalid format:", error);
        return {
          isError: true,
          message: "The response to your request was in an invalid format.",
        };
      }

      return json || {};
    },
    [logout, navigate]
  );

  const get = useCallback(
    ({ ...args }: Omit<ApiArguments, "method">): Promise<ApiResponse> =>
      send({ method: "GET", ...args }),
    [send]
  );

  const post = useCallback(
    async ({ ...args }: Omit<ApiArguments, "method">): Promise<ApiResponse> => {
      // API requires a valid CSRF token to process a POST request. Calling get
      // on this route has the side effect of setting that token.
      await get({ url: getRouteFn("csrfToken")() });

      return send({
        headers_init: {
          "X-CSRFToken": Cookies.get("csrftoken"),
          ...args.headers_init,
        },
        method: "POST",
        ...omit(args, "headers"),
      });
    },
    [get, send]
  );

  return { get, getRouteFn, post, send };
}
