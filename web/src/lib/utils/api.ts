import { ApiResponse } from "../../hooks/useApi";
import { forOwn, head } from "lodash";
import { ReactNode } from "react";

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
  }
): boolean {
  if (response.isError) {
    if (setAlert) setAlert(response.message || defaultAlert);

    if (setFieldError) {
      forOwn(response.errors, (value, key) => setFieldError(key, head(value)));
    }

    return true;
  }

  return false;
}
