import { expect, test } from "vitest";
import { box, unbox } from "utils/encryption";

test("value encrypted from `box` function should `unbox` to the same value", () => {
  const MESSAGE = "Roy Mustang";
  const KEY = Buffer.from("KEY");

  const messageBuffer = Buffer.from(MESSAGE);

  const boxed = box(messageBuffer, KEY);
  const unboxed = unbox(boxed, Buffer.from("KEY"));

  expect(unboxed.toString()).toEqual(MESSAGE);
});
