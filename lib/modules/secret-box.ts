import { crypto_secretbox_easy, crypto_secretbox_open_easy } from "chloride";
import { BOX_NONCEBYTES, HASH_SALTBYTES } from "constants/crypto";
import { sliceBuffer } from "utils/buffer";
import { generateRandomBuffer, saltHash } from "utils/crypto";
import { keyPairDecrypt, keyPairEncrypt } from "utils/encryption";
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
    return Buffer.from(this.options.key);
  }

  public async encrypt(
    arrayBuffer: WithImplicitCoercion<string | Uint8Array | readonly number[]>,
    pair: KeyPair
  ) {
    if (!isValidKeyPair(pair)) throw Error(Errors.INVALID_KEY);
    if (!this.usesKey()) return keyPairEncrypt(Buffer.from(arrayBuffer), pair);

    const key = this.getKey();
    const { salt, hash } = saltHash(key);
    const nonce = generateRandomBuffer(BOX_NONCEBYTES);

    const cipherText = crypto_secretbox_easy(
      Buffer.from(arrayBuffer),
      nonce,
      hash
    );

    const encrypted = keyPairEncrypt(
      Buffer.concat([salt, nonce, cipherText]),
      pair
    );

    return encrypted;
  }

  public async decrypt(buffer: Buffer, pair: KeyPair) {
    if (!isValidKeyPair(pair)) throw Error(Errors.INVALID_KEY);
    if (!this.usesKey()) return keyPairDecrypt(buffer, pair);

    const encrypted = keyPairDecrypt(buffer, pair);

    const metaDataLength = HASH_SALTBYTES + BOX_NONCEBYTES;

    const key = this.getKey();
    const salt = sliceBuffer(encrypted, 0, HASH_SALTBYTES);
    const nonce = sliceBuffer(encrypted, HASH_SALTBYTES, metaDataLength);
    const cipherText = sliceBuffer(encrypted, metaDataLength);

    const { hash } = saltHash(key, salt);

    const decrypted = crypto_secretbox_open_easy(cipherText, nonce, hash);
    if (!decrypted) throw Error(Errors.DECRYPTION_FAILED);

    return decrypted;
  }
}
