import { crypto_box_easy, crypto_box_open_easy, crypto_box_MACBYTES } from "sodium-native";
import { BOX_NONCEBYTES } from "constants/crypto";
import { sliceBuffer } from "utils/buffer";
import { generateRandomBuffer } from "utils/crypto";
import { getKeyBuffer, isValidKeyPair } from "utils/keys";
import { Errors } from "typings/errors";
import type { KeyPair } from "typings/key-types";

export const extractNonce = (buffer: Buffer) => {
  if (buffer.byteLength < BOX_NONCEBYTES) throw Error(Errors.BUFFER_TOO_SHORT);

  const nonce = sliceBuffer(buffer, 0, BOX_NONCEBYTES);
  const encrypted = sliceBuffer(buffer, BOX_NONCEBYTES);

  return Object.freeze({ nonce, encrypted });
};

export const keyPairEncrypt = (buffer: Buffer, pair: KeyPair) => {
  if (!isValidKeyPair(pair)) throw Error(Errors.INVALID_KEY);

  const nonce = generateRandomBuffer(BOX_NONCEBYTES);
  const publicKey = getKeyBuffer(pair.public);
  const privateKey = getKeyBuffer(pair.private);

  const encrypted = Buffer.alloc(buffer.length + crypto_box_MACBYTES);
  crypto_box_easy(encrypted, buffer, nonce, publicKey, privateKey);

  return Buffer.concat([nonce, encrypted]);
};

export const keyPairDecrypt = (cipher: Buffer, pair: KeyPair) => {
  if (!isValidKeyPair(pair)) throw Error(Errors.INVALID_KEY);

  const { nonce, encrypted } = extractNonce(cipher);
  const publicKey = getKeyBuffer(pair.public);
  const privateKey = getKeyBuffer(pair.private);

  const decrypted = Buffer.alloc(encrypted.length - crypto_box_MACBYTES);
  
  const success = crypto_box_open_easy(
    decrypted,
    encrypted,
    nonce,
    publicKey,
    privateKey
  );

  if (!success) throw Error(Errors.DECRYPTION_FAILED);
  return decrypted;
};
