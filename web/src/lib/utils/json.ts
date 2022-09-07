import { forOwn, isArray, isPlainObject, isString } from "lodash";

export function stringifyIdsDeeply(obj: { id?: string }) {
  forOwn(obj, (value: any, key: string | Symbol) => {
    if (isString(key)) {
      if (isArray(value)) {
        value.map((v) => stringifyIdsDeeply(v));
      } else if (isPlainObject(value)) {
        stringifyIdsDeeply(value);
      } else {
        if ("id" === key) {
          obj[key] = String(value);
        }
      }
    }
  });
}
