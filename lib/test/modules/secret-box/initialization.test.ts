import { test, expect } from "vitest";

import { SecretBox } from "modules/secret-box";
import { generateKeyPair } from "utils/keys";
import { Errors } from "typings/errors";

const MASTER_KEY = "";

test("initialized `SecretBox` throw when `withoutMasterKey` is called twice", () => {
  const initialize = () =>
    new SecretBox().withoutMasterKey().withoutMasterKey();

  expect(initialize).toThrowError(Errors.ALREADY_INITIALIZED);
});

test("initialized `SecretBox` throw when `withMasterKey` is called twice", () => {
  const initialize = () =>
    new SecretBox().withMasterKey(MASTER_KEY).withMasterKey(MASTER_KEY);

  expect(initialize).toThrowError(Errors.ALREADY_INITIALIZED);
});

test("initialized `SecretBox` throw when `withMasterKey` is called after `withoutMasterKey`", () => {
  const initialize = () =>
    new SecretBox().withoutMasterKey().withMasterKey(MASTER_KEY);

  expect(initialize).toThrowError(Errors.ALREADY_INITIALIZED);
});

test("initialized `SecretBox` throw when `withoutMasterKey` is called after `withMasterKey`", () => {
  const initialize = () =>
    new SecretBox().withMasterKey(MASTER_KEY).withoutMasterKey();

  expect(initialize).toThrowError(Errors.ALREADY_INITIALIZED);
});

test("encryption fails on uninitialized `SecretBox` instance", () => {
  const pair = generateKeyPair();
  const encrypt = () => new SecretBox().encrypt("message", pair);

  expect(encrypt).rejects.toThrowError(Errors.UNINITIALIZED);
});

test("encryption fails on uninitialized `SecretBox` instance", () => {
  const pair = generateKeyPair();
  const decrypt = () => new SecretBox().decrypt(Buffer.alloc(16), pair);

  expect(decrypt).rejects.toThrowError(Errors.UNINITIALIZED);
});

test("`SecretBox` instantiated without key throws error if key is accessed", () => {
  const box = new SecretBox();
  const prototype = Object.getPrototypeOf(box);

  const getKey = () => prototype.getKey();

  expect(getKey).toThrowError(Errors.KEY_NOT_FOUND);
});
