import { pick, set } from "lodash";

export function stringifyValue(obj: object, path: string): object {
  const value = pick(obj, path);
  return value ? set(obj, path, String(value)) : obj;
}
