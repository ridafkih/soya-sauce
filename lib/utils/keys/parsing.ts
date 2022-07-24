import { isValidKey } from "utils/keys/validation";
import { Errors } from "typings/errors";
import type { SomeKey } from "typings/key-types";

export const parseKey = (candidate: string) => {
  const [type, key] = candidate.split("$") as (string | undefined)[];
  return { type, key };
};

export const getKeyBuffer = <T extends SomeKey>(candidate: T) => {
  if (!isValidKey(candidate)) throw Error(Errors.INVALID_KEY);
  const { key } = parseKey(candidate);

  if (!key) throw Error(Errors.INVALID_KEY);
  return Buffer.from(key, "base64");
};
