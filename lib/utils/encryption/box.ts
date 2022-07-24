import { crypto_secretbox_easy } from "chloride";
import { BOX_NONCEBYTES, HASH_SALTBYTES } from "constants/crypto";
import { sliceBuffer } from "utils/buffer";
import { generateRandomBuffer, saltHash } from "utils/crypto";

const METADATA_LENGTH = HASH_SALTBYTES + BOX_NONCEBYTES;

export const box = (buffer: Buffer, key: Buffer) => {
  const { salt, hash } = saltHash(key);
  const nonce = generateRandomBuffer(BOX_NONCEBYTES);
  const cipher = crypto_secretbox_easy(buffer, nonce, hash);

  return Buffer.concat([salt, nonce, cipher]);
};

export const unbox = (boxed: Buffer, key: Buffer) => {
  const salt = sliceBuffer(boxed, 0, HASH_SALTBYTES);
  const nonce = sliceBuffer(boxed, HASH_SALTBYTES, METADATA_LENGTH);
  const cipher = sliceBuffer(boxed, METADATA_LENGTH);
  const { hash } = saltHash(key, salt);

  return crypto_secretbox_easy(cipher, nonce, hash);
};
