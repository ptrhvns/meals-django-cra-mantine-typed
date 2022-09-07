import { ApiResponse } from "../../hooks/useApi";
import { forOwn, head } from "lodash";
import { ReactNode } from "react";

export function handledApiError(
  response: ApiResponse,
  {
    setAlert,
    setFieldError,
  }: {
    setAlert?: (s: string | undefined) => void;
    setFieldError?: (path: string, error: ReactNode) => void;
  }
): boolean {
  if (response.isError) {
    if (setAlert) setAlert(response.message);

    if (setFieldError) {
      forOwn(response.errors, (value, key) => setFieldError(key, head(value)));
    }

    return true;
  }

  return false;
}
