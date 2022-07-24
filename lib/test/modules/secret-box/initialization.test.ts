import { test, expect, it } from "vitest";

import { SecretBox } from "modules/secret-box";
import { Errors } from "typings/errors";

const MASTER_KEY = "";

test("initialized `SecretBox` throw when `withoutMasterKey` is called twice", () => {
  const initialize = () =>
    new SecretBox().withoutMasterKey().withoutMasterKey();

  expect(initialize).toThrow(Errors.ALREADY_INITIALIZED);
});

test("initialized `SecretBox` throw when `withMasterKey` is called twice", () => {
  const initialize = () =>
    new SecretBox().withMasterKey(MASTER_KEY).withMasterKey(MASTER_KEY);

  expect(initialize).toThrow(Errors.ALREADY_INITIALIZED);
});

test("initialized `SecretBox` throw when `withMasterKey` is called after `withoutMasterKey`", () => {
  const initialize = () =>
    new SecretBox().withoutMasterKey().withMasterKey(MASTER_KEY);

  expect(initialize).toThrow(Errors.ALREADY_INITIALIZED);
});

test("initialized `SecretBox` throw when `withoutMasterKey` is called after `withMasterKey`", () => {
  const initialize = () =>
    new SecretBox().withMasterKey(MASTER_KEY).withoutMasterKey();

  expect(initialize).toThrow(Errors.ALREADY_INITIALIZED);
});
