import { ApiResponse } from "../hooks/useApi";
import { forOwn, head } from "lodash";
import { ReactNode } from "react";

/**
 * Build a string to use in a <title> tag.
 *
 * @param {string} [subtitle] - caller defined part of the title
 * @returns {string} full string to use in <title>
 */
export function buildTitle(subtitle?: string): string {
  return subtitle ? `${subtitle} - Meals` : "Meals";
}

/**
 * Handle errors (general, form inputs) returned by API.
 *
 * @param {ApiResponse} response - object returned from API call (see useApi
 *    hook)
 * @param {options} options - optional arguments
 * @param {string} options.defaultAlert - default message passed to setAlert
 * @param {string | undefined} options.setAlert - callback to send general error
 * @param {(path: string, error: ReactNode) => void} options.setFieldError -
 *    callback to send form input errors
 * @returns {boolean} true if response was handled as an error, false otherwise
 */
export function handledApiError(
  response: ApiResponse,
  {
    defaultAlert,
    setAlert,
    setFieldError,
  }: {
    defaultAlert?: string;
    setAlert?: (s: string | undefined) => void;
    setFieldError?: (path: string, error: ReactNode) => void;
  } = {}
): boolean {
  if (!response.isError) return false;
  if (setAlert) setAlert(response.message || defaultAlert);

  if (setFieldError) {
    forOwn(response.errors, (value, key) => setFieldError(key, head(value)));
  }

  return true;
}
