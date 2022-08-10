import { crypto_box_keypair, crypto_box_SECRETKEYBYTES, crypto_box_PUBLICKEYBYTES } from "sodium-native";
import type { KeyPair } from "typings/key-types";

/**
 * Generates an easy-to-store keypair.
 * @returns A keypair object.
 */
export const generateKeyPair = (): KeyPair => {
  const publicKey = Buffer.alloc(crypto_box_PUBLICKEYBYTES);
  const secretKey = Buffer.alloc(crypto_box_SECRETKEYBYTES);
  crypto_box_keypair(publicKey, secretKey);

  return Object.freeze({
    private: `private$${secretKey.toString("base64")}`,
    public: `public$${publicKey.toString("base64")}`,
  });
};
