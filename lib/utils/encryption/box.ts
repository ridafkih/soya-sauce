import { crypto_secretbox_easy, crypto_secretbox_MACBYTES, crypto_secretbox_open_easy } from "sodium-native";
import { BOX_NONCEBYTES, HASH_SALTBYTES } from "constants/crypto";
import { sliceBuffer } from "utils/buffer";
import { generateRandomBuffer, saltHash } from "utils/crypto";
import { Errors } from "typings/errors";

const METADATA_LENGTH = HASH_SALTBYTES + BOX_NONCEBYTES;

export const box = (buffer: Buffer, key: Buffer) => {
  const { salt, hash } = saltHash(key);
  const nonce = generateRandomBuffer(BOX_NONCEBYTES);
  const cipher = Buffer.alloc(buffer.length + crypto_secretbox_MACBYTES);
  crypto_secretbox_easy(cipher, buffer, nonce, hash);

  return Buffer.concat([salt, nonce, cipher]);
};

export const unbox = (boxed: Buffer, key: Buffer) => {
  const salt = sliceBuffer(boxed, 0, HASH_SALTBYTES);
  const nonce = sliceBuffer(boxed, HASH_SALTBYTES, METADATA_LENGTH);
  const cipher = sliceBuffer(boxed, METADATA_LENGTH);
  const { hash } = saltHash(key, salt);

  const unboxed = Buffer.alloc(cipher.length - crypto_secretbox_MACBYTES);
  const success = crypto_secretbox_open_easy(unboxed, cipher, nonce, hash);

  if (!success) throw Error(Errors.DECRYPTION_FAILED);
  return unboxed;
};
