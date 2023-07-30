import pkg from "./package.json";
// @ts-ignore
import commonjs from "@rollup/plugin-commonjs";
// @ts-ignore
import terser from "@rollup/plugin-terser";
// @ts-ignore
import { babel } from "@rollup/plugin-babel";

const footer = `
if(typeof window !== 'undefined') {
  window.NPM_ANA_VERSION = '${pkg.version}'
}`;

export default {
  input: "src/core/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "auto",
      footer,
    },
  ],
  watch: {
    exclude: "node_modules/**",
  },
  plugins: [
    commonjs(),
    terser(),
    babel({ exclude: "node_modules/**", babelHelpers: "bundled" }),
  ],
};
