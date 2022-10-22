import { test, describe, expect } from "vitest";

import { SecretBox } from "modules/secret-box";
import { generateKeyPair } from "utils/keys";
import { Errors } from "typings/errors";
import { PrivateKey, PublicKey } from "typings/key-types";

test("message encrypted with a `SecretBox` initialized without a master key should equal itself when decrypted", async () => {
  const MESSAGE =
    "Thor Odinson is the Asgardian God of Thunder, the former king of Asgard and New Asgard, and a founding member of the Avengers.";

  const thor = generateKeyPair();
  const tony = generateKeyPair();

  const box = new SecretBox().withoutMasterKey();

  const encrypted = await box.encrypt(MESSAGE, {
    private: thor.private,
    public: tony.public,
  });

  const decrypted = await box.decrypt(encrypted, {
    private: tony.private,
    public: thor.public,
  });

  expect(decrypted.toString()).toEqual(MESSAGE);
});

test("message encrypted with a `SecretBox` initialized with a master key should equal itself when decrypted", async () => {
  const MASTER_KEY = "The Philosopher's Stone";
  const MESSAGE =
    "Edward, titled the Fullmetal Alchemist, is the youngest State Alchemist in the history of the fictional country of Amestris.";

  const box = new SecretBox().withMasterKey(MASTER_KEY);

  const edward = generateKeyPair();
  const alphonse = generateKeyPair();

  const encrypted = await box.encrypt(MESSAGE, {
    private: edward.private,
    public: alphonse.public,
  });

  const decrypted = await box.decrypt(encrypted, {
    private: alphonse.private,
    public: edward.public,
  });

  expect(decrypted.toString()).toEqual(MESSAGE);
});

test("two `SecretBox` instances initilized with the same master key yield the same message", async () => {
  const MESSAGE =
    "Donna Pinciotti is a main character on FOX comedy That '70s Show. She is portrayed by Laura Prepon.";

  const donna = generateKeyPair();
  const eric = generateKeyPair();

  const encryptionBox = new SecretBox().withMasterKey("1970");
  const decryptionBox = new SecretBox().withMasterKey("1970");

  const encrypted = await encryptionBox.encrypt(MESSAGE, {
    private: donna.private,
    public: eric.public,
  });

  const decrypted = await decryptionBox.decrypt(encrypted, {
    private: eric.private,
    public: donna.public,
  });

  expect(decrypted.toString()).toEqual(MESSAGE);
});

test("two `SecretBox` instances initilized with different master keys do not yield a decrypted message", async () => {
  const MESSAGE =
    "Donna Pinciotti is a main character on FOX comedy That '70s Show. She is portrayed by Laura Prepon.";

  const donna = generateKeyPair();
  const eric = generateKeyPair();

  const encryptionBox = new SecretBox().withMasterKey("1970");
  const decryptionBox = new SecretBox().withMasterKey("1971");

  const encrypted = await encryptionBox.encrypt(MESSAGE, {
    private: donna.private,
    public: eric.public,
  });

  const decrypt = () =>
    decryptionBox.decrypt(encrypted, {
      private: eric.private,
      public: donna.public,
    });

  expect(decrypt).rejects.toThrowError(Errors.DECRYPTION_FAILED);
});

describe("encryption with invalid keys throws error", () => {
  const MESSAGE =
    "Sam Wilson (Anthony Mackie) finally gets back Captain America's shield and chooses to accept the mantle.";

  const bucky = generateKeyPair();

  const box = new SecretBox().withoutMasterKey();

  test("should not allow encryption with two private keys", () => {
    const encrypt = () =>
      box.encrypt(MESSAGE, {
        private: bucky.private,
        public: <PublicKey>bucky.private,
      });

    expect(encrypt).rejects.toThrowError(Errors.INVALID_KEY);
  });

  test("should not allow encryption with two public keys", () => {
    const encrypt = () =>
      box.encrypt(MESSAGE, {
        private: <PrivateKey>bucky.public,
        public: bucky.public,
      });

    expect(encrypt).rejects.toThrowError(Errors.INVALID_KEY);
  });

  test("should not allow encryption with an invalid public key", () => {
    const encrypt = () =>
      box.encrypt(MESSAGE, {
        private: bucky.private,
        public: <PublicKey>"vibranium",
      });

    expect(encrypt).rejects.toThrowError(Errors.INVALID_KEY);
  });

  test("should not allow encryption with an invalid private key", () => {
    const encrypt = () =>
      box.encrypt(MESSAGE, {
        private: <PrivateKey>"vibranium",
        public: bucky.public,
      });

    expect(encrypt).rejects.toThrowError(Errors.INVALID_KEY);
  });
});

describe("decryption with invalid keys throws error", async () => {
  const MESSAGE =
    "Sam Wilson (Anthony Mackie) finally gets back Captain America's shield and chooses to accept the mantle.";

  const bucky = generateKeyPair();
  const sam = generateKeyPair();

  const box = new SecretBox().withoutMasterKey();

  const encrypted = await box.encrypt(MESSAGE, {
    private: bucky.private,
    public: sam.public,
  });

  test("should not allow decryption with two private keys", () => {
    const encrypt = () =>
      box.decrypt(encrypted, {
        private: bucky.private,
        public: <PublicKey>bucky.private,
      });

    expect(encrypt).rejects.toThrowError(Errors.INVALID_KEY);
  });

  test("should not allow decryption with two public keys", () => {
    const encrypt = () =>
      box.decrypt(encrypted, {
        private: <PrivateKey>bucky.public,
        public: bucky.public,
      });

    expect(encrypt).rejects.toThrowError(Errors.INVALID_KEY);
  });

  test("should not allow decryption with an invalid public key", () => {
    const encrypt = () =>
      box.decrypt(encrypted, {
        private: bucky.private,
        public: <PublicKey>"vibranium",
      });

    expect(encrypt).rejects.toThrowError(Errors.INVALID_KEY);
  });

  test("should not allow decryption with an invalid private key", () => {
    const encrypt = () =>
      box.decrypt(encrypted, {
        private: <PrivateKey>"vibranium",
        public: bucky.public,
      });

    expect(encrypt).rejects.toThrowError(Errors.INVALID_KEY);
  });
});

test("should be able to encrypt without public keys, granted a master key is provided", async () => {
  const masterKeyBox = new SecretBox({ disableKeyPairs: true }).withMasterKey("vibranium");
  const cipherText = await masterKeyBox.encrypt("Wakanda");
  expect(cipherText).toBeInstanceOf(Buffer);
});

test("should be able to decrypt without public keys, granted a master key is provided", async () => {
  const WAKANDA_CIPHERTEXT = Buffer.from("444e9477420b29105b5c8b0b3c97ac2d3c7fcfcf82022c1477854655beb7877d3a27bba8f08e155587cc32e83688a3216ba1f11f6dcce97ca659f5190b2bb4", "hex");
  const masterKeyBox = new SecretBox({ disableKeyPairs: true }).withMasterKey("vibranium");
  const decrypted = await masterKeyBox.decrypt(WAKANDA_CIPHERTEXT);
  expect(decrypted.toString()).toBe("Wakanda");
});