type KeyString = string[44];

export type PrivateKey = `private$${KeyString}`;
export type PublicKey = `public$${KeyString}`;
export type SomeKey = PrivateKey | PublicKey;

export type KeyPair = {
  private: PrivateKey;
  public: PublicKey;
};
