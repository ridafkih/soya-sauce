import { parseKey } from "utils/keys/parsing";
import type {
  KeyPair,
  PrivateKey,
  PublicKey,
  SomeKey,
} from "typings/key-types";

export const isValidKey = (candidate: string): candidate is SomeKey => {
  const { type, key } = parseKey(candidate);

  if (!type || !key) return false;
  if (key.length !== 44) return false;
  return type === "public" || type === "private";
};

export const isTypeOfKey = <T extends "public" | "private">(
  type: T,
  candidate: SomeKey
): candidate is T extends "private"
  ? PrivateKey
  : T extends "public"
  ? PublicKey
  : unknown => {
  const isKeyValid = isValidKey(candidate);
  if (!isKeyValid) return false;

  const parsedKey = parseKey(candidate);
  return parsedKey.type === type;
};

export const isValidKeyPair = (pair: KeyPair) =>
  isTypeOfKey("private", pair.private) && isTypeOfKey("public", pair.public);
