import { SecretBox } from "modules/secret-box";
import { generateKeyPair } from "utils/keys";

import { test, expect } from "vitest";

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

  const decrypted = await decryptionBox
    .decrypt(encrypted, {
      private: eric.private,
      public: donna.public,
    })
    .catch(() => void 0);

  expect(decrypted?.toString()).toBeUndefined();
});
