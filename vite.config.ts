import { resolve } from "path";
import { defineConfig } from "vitest/config";

const folders = ["constants", "modules", "typings", "utils"];

export default defineConfig({
  resolve: {
    alias: folders.reduce(
      (accumulator, name) => ({
        ...accumulator,
        [name]: resolve(__dirname, `lib/${name}/`),
      }),
      {}
    ),
  },
});
