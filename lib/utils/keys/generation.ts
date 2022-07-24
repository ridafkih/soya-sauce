import { crypto_box_keypair } from "chloride";
import { KeyPair } from "typings/key-types";

/**
 * Generates an easy-to-store keypair.
 * @returns A keypair object.
 */
export const generateKeyPair = (): KeyPair => {
  const { publicKey, secretKey } = crypto_box_keypair();

  return Object.freeze({
    private: `private$${secretKey.toString("base64")}`,
    public: `public$${publicKey.toString("base64")}`,
  });
};
