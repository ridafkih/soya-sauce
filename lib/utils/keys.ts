import type { PrivateKey, PublicKey, SomeKey } from "typings/key-types";

const parseKey = (candidate: string) => {
  const [type, key] = candidate.split("$") as (string | undefined)[];
  return { type, key };
};

const isValidKey = (candidate: string): candidate is SomeKey => {
  const { type, key } = parseKey(candidate);

  if (!type || !key) return false;
  if (key.length !== 44) return false;
  return type === "public" || type === "private";
};

export const isTypeOfKey = <T extends "public" | "private">(
  type: T,
  candidate: SomeKey
): candidate is T extends "private" ? PrivateKey : PublicKey => {
  const isKeyValid = isValidKey(candidate);
  if (!isKeyValid) return false;

  const parsedKey = parseKey(candidate);
  return parsedKey.type === type;
};