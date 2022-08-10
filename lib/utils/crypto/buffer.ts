import { randombytes_buf } from "sodium-native";

export const generateRandomBuffer = (length: number) => {
  const buffer = Buffer.alloc(length);
  randombytes_buf(buffer);
  return buffer;
};
