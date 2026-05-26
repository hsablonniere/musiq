import { litPlugin } from "@custom-elements-manifest/analyzer/src/features/framework-plugins/lit/lit.js";

export default {
  globs: ["src/**/*.ts"],
  exclude: ["src/**/*.html"],
  litelement: true,
  plugins: [...litPlugin()],
};
