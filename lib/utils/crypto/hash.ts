import { crypto_pwhash } from "sodium-native";
import {
  HASH_ALG_ARGON2ID13,
  HASH_MEMLIMIT_MODERATE,
  HASH_OPSLIMIT_MODERATE,
  HASH_SALTBYTES,
} from "constants/crypto";
import { generateRandomBuffer } from "utils/crypto/buffer";

/**
 * Hashes a buffer.
 * @param buffer The buffer that will be hashed.
 * @param salt The salt to hash the buffer, if none is provided it will be generated.
 * @returns A buffer in which the salt (16 bytes), and the hash (32 bytes) are respectively concatenated.
 */
export const saltHash = (buffer: Buffer, salt?: Buffer) => {
  const hash = Buffer.alloc(32);
  if (!salt) salt = generateRandomBuffer(HASH_SALTBYTES);

  crypto_pwhash(
    hash,
    buffer,
    salt,
    HASH_OPSLIMIT_MODERATE,
    HASH_MEMLIMIT_MODERATE,
    HASH_ALG_ARGON2ID13
  );

  return { salt, hash };
};
