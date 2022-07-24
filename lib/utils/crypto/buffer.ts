import { randombytes } from "chloride";

export const generateRandomBuffer = (length: number) => {
  const buffer = Buffer.alloc(length);
  randombytes(buffer);
  return buffer;
};
