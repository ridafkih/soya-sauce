import { test, expect, it } from "vitest";

import { SecretBox } from "modules/secret-box";
import { Errors } from "typings/errors";

test("initialized `SecretBox` cannot be initialized again", () => {
  const MASTER_KEY = "";

  it("should throw when `withoutMasterKey` is called twice", () => {
    const initialize = () =>
      new SecretBox().withoutMasterKey().withoutMasterKey();

    expect(initialize).rejects.toThrow(Errors.ALREADY_INITIALIZED);
  });

  it("should throw when `withMasterKey` is called twice", () => {
    const initialize = () =>
      new SecretBox().withMasterKey(MASTER_KEY).withMasterKey(MASTER_KEY);

    expect(initialize).rejects.toThrow(Errors.ALREADY_INITIALIZED);
  });

  it("should throw when `withMasterKey` is called after `withoutMasterKey`", () => {
    const initialize = () =>
      new SecretBox().withoutMasterKey().withMasterKey(MASTER_KEY);

    expect(initialize).rejects.toThrow(Errors.ALREADY_INITIALIZED);
  });

  it("should throw when `withoutMasterKey` is called after `withMasterKey`", () => {
    const initialize = () =>
      new SecretBox().withMasterKey(MASTER_KEY).withoutMasterKey();

    expect(initialize).rejects.toThrow(Errors.ALREADY_INITIALIZED);
  });
});
