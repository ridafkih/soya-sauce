import { crypto_secretbox_easy, crypto_secretbox_open_easy } from "chloride";
import { BOX_NONCEBYTES, HASH_SALTBYTES } from "constants/crypto";
import { sliceBuffer } from "utils/buffer";
import { generateRandomBuffer, saltHash } from "utils/crypto";
import { box, keyPairDecrypt, keyPairEncrypt, unbox } from "utils/encryption";
import { isValidKeyPair } from "utils/keys";
import { Errors } from "typings/errors";
import { KeyPair } from "typings/key-types";

export class SecretBox {
  private initialized = false;
  private key?: string;

  public withMasterKey(masterKey: string) {
    if (this.initialized) throw Error(Errors.ALREADY_INITIALIZED);
    this.key = masterKey;
    this.initialized = true;
    return this;
  }

  public withoutMasterKey() {
    if (this.initialized) throw Error(Errors.ALREADY_INITIALIZED);
    this.initialized = true;
    return this;
  }

  private usesKey() {
    return !!this.key;
  }

  private getKey() {
    if (!this.key) throw Error(Errors.KEY_NOT_FOUND);
    return Buffer.from(this.key);
  }

  public async encrypt(
    arrayBuffer: WithImplicitCoercion<string | Uint8Array | readonly number[]>,
    pair: KeyPair
  ) {
    if (!this.initialized) throw Error(Errors.UNINITIALIZED);
    if (!isValidKeyPair(pair)) throw Error(Errors.INVALID_KEY);
    if (!this.usesKey()) return keyPairEncrypt(Buffer.from(arrayBuffer), pair);

    return keyPairEncrypt(box(Buffer.from(arrayBuffer), this.getKey()), pair);
  }

  public async decrypt(buffer: Buffer, pair: KeyPair) {
    if (!this.initialized) throw Error(Errors.UNINITIALIZED);
    if (!isValidKeyPair(pair)) throw Error(Errors.INVALID_KEY);
    if (!this.usesKey()) return keyPairDecrypt(buffer, pair);

    const cipher = keyPairDecrypt(buffer, pair);
    const decrypted = unbox(cipher, this.getKey());

    if (!decrypted) throw Error(Errors.DECRYPTION_FAILED);

    return decrypted;
  }
}
