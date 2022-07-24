import { crypto_secretbox_easy, crypto_secretbox_open_easy } from "chloride";
import { BOX_NONCEBYTES, HASH_SALTBYTES } from "constants/crypto";
import { sliceBuffer } from "utils/buffer";
import { generateRandomBuffer, saltHash } from "utils/crypto";
import { keyPairEncrypt } from "utils/encryption";
import { isValidKeyPair } from "utils/keys";
import { Errors } from "typings/errors";
import { KeyPair } from "typings/key-types";

type SecretBoxOptions =
  | {
      useKey: true;
      key: string;
    }
  | {
      useKey: false;
    };

export class SecretBox {
  constructor(private readonly options: SecretBoxOptions) {}

  private usesKey() {
    return this.options.useKey;
  }

  private getKey() {
    if (!this.options.useKey) throw Error(Errors.KEY_NOT_FOUND);
    return this.options.key;
  }

  public encrypt(
    arrayBuffer: WithImplicitCoercion<string | Uint8Array | readonly number[]>,
    pair: KeyPair
  ) {
    if (!isValidKeyPair(pair)) throw Error(Errors.INVALID_KEY);
    if (!this.usesKey()) return keyPairEncrypt(Buffer.from(arrayBuffer), pair);

    const key = this.getKey();
    const { salt, hash } = saltHash(Buffer.from(key));
    const nonce = generateRandomBuffer(BOX_NONCEBYTES);

    const cipherText = crypto_secretbox_easy(
      Buffer.from(arrayBuffer),
      nonce,
      hash
    );

    return keyPairEncrypt(Buffer.concat([salt, nonce, cipherText]), pair);
  }

  public decrypt(encrypted: Buffer, pair: KeyPair) {
    if (!isValidKeyPair(pair)) throw Error(Errors.INVALID_KEY);
    if (!this.usesKey()) return keyPairEncrypt(encrypted, pair);

    const salt = sliceBuffer(encrypted, 0, HASH_SALTBYTES);
    const nonce = sliceBuffer(encrypted, HASH_SALTBYTES, BOX_NONCEBYTES);
    const cipherText = sliceBuffer(encrypted, HASH_SALTBYTES + BOX_NONCEBYTES);

    const { hash } = saltHash(cipherText, salt);

    const decrypted = crypto_secretbox_open_easy(encrypted, nonce, hash);
    return decrypted;
  }
}
