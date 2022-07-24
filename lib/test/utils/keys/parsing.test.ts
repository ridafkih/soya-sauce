import { expect, test } from "vitest";
import { getKeyBuffer } from "utils/keys";
import { Errors } from "typings/errors";

test("`getKeyBuffer` fails if provided an empty key.", () => {
  const invalidKey = "public$";
  const getBuffer = () => getKeyBuffer(invalidKey);

  expect(getBuffer).toThrowError(Errors.INVALID_KEY);
});

test("`getKeyBuffer` fails if provided an invalid key.", () => {
  const invalidKey = "public$invalid_key";
  const getBuffer = () => getKeyBuffer(invalidKey);

  expect(getBuffer).toThrowError(Errors.INVALID_KEY);
});
