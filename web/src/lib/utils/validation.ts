import { ValidateFunction } from "ajv/dist/types";

export function handledInvalidData<T>(
  validate: ValidateFunction<T>,
  data: object,
  cb: (message: string) => void
): boolean {
  if (!validate(data)) {
    console.error("Response contained invalid information:", validate.errors);
    cb("The response to your request contained invalid information.");
    return true;
  }

  return false;
}
