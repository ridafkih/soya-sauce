import { expect, test } from "vitest";
import { extractNonce, keyPairDecrypt, keyPairEncrypt } from "utils/encryption";
import { generateKeyPair } from "utils/keys";
import { Errors } from "typings/errors";
import { KeyPair } from "typings/key-types";

test("nonce below BOX_NONCEBYTES into `extractNonce` throws an error", () => {
  const shortBuffer = Buffer.alloc(8);
  const extract = () => extractNonce(shortBuffer);

  expect(extract).toThrowError(Errors.BUFFER_TOO_SHORT);
});

test("if invalid keypair is provided to `keyPairEncrypt` it throws error", () => {
  const buffer = Buffer.alloc(16);
  const invalidKeyPair = { private: "private$", public: "public$" };

  const encrypt = () => keyPairEncrypt(buffer, <KeyPair>invalidKeyPair);
  expect(encrypt).toThrowError(Errors.INVALID_KEY);
});

test("if invalid keypair is provided to `keyPairDecrypt` it throws error", () => {
  const buffer = Buffer.alloc(16);
  const invalidKeyPair = { private: "private$", public: "public$" };

  const decrypt = () => keyPairDecrypt(buffer, <KeyPair>invalidKeyPair);
  expect(decrypt).toThrowError(Errors.INVALID_KEY);
});

test("if `keyPairDecrypt` cannot decrypt the message, it fails", () => {
  const MESSAGE = Buffer.from("Westalis is in danger.");

  const loid = generateKeyPair();
  const yor = generateKeyPair();
  const anya = generateKeyPair();

  const encrypted = keyPairEncrypt(MESSAGE, {
    private: loid.private,
    public: yor.public,
  });

  const decrypt = () =>
    keyPairDecrypt(encrypted, {
      private: anya.private,
      public: loid.public,
    });

  expect(decrypt).toThrowError(Errors.DECRYPTION_FAILED);
});
