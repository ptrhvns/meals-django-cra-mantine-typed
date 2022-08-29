import { ApiResponse } from "../../hooks/useApi";

export function handledApiError(
  response: ApiResponse,
  { setAlert }: { setAlert?: (s: string | undefined) => void }
): boolean {
  if (response.isError) {
    if (setAlert) setAlert(response.message);
    return true;
  }

  return false;
}
