import { test, expect } from "vitest";
import { isTypeOfKey } from "utils/keys/validation";

test("`isTypeOfKey` returns false if given invalid key.", () => {
  const isValid = isTypeOfKey("public", "public$");
  expect(isValid).toBe(false);
});
