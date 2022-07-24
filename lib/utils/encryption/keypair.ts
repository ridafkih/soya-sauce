import { crypto_box_easy } from "chloride";
import { BOX_NONCEBYTES } from "constants/crypto";
import { generateRandomBuffer } from "utils/crypto";
import { getKeyBuffer, isTypeOfKey } from "utils/keys";
import { Errors } from "typings/errors";
import { KeyPair } from "typings/key-types";

export const keyPairEncrypt = (buffer: Buffer, options: KeyPair) => {
  const isPublicKeyValid = isTypeOfKey("public", options.public);
  const isPrivateKeyValid = isTypeOfKey("public", options.private);

  if (!isPublicKeyValid || !isPrivateKeyValid) throw Error(Errors.INVALID_KEY);

  const nonce = generateRandomBuffer(BOX_NONCEBYTES);
  const publicKey = getKeyBuffer(options.public);
  const privateKey = getKeyBuffer(options.private);

  const encrypted = crypto_box_easy(buffer, nonce, publicKey, privateKey);

  return Buffer.concat([nonce, encrypted]);
};
