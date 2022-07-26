export enum Errors {
  BUFFER_TOO_SHORT = "The buffer size is too short to extract a message.",
  INVALID_KEY = "The key supplied didn't match it's intended use.",
  KEY_NOT_FOUND = "The key does not exist.",
  ENCRYPTION_FAILED = "The encryption failed, a key or key-pair may be invalid.",
  DECRYPTION_FAILED = "The decryption failed, a key or key-pair may be invalid.",
  UNINITIALIZED = "The SecretBox instance was not initialized, but an encrypt/decrypt call was made.",
  ALREADY_INITIALIZED = "The SecretBox instance was already initialized, but was initialized again.",
}
