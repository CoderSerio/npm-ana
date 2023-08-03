/* eslint-disable @typescript-eslint/ban-ts-comment */
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import { babel } from "@rollup/plugin-babel";
import typescript from "rollup-plugin-typescript2";

export default [
  {
    input: "src/core/index.ts",
    output: [
      {
        file: "lib/index.js",
        format: "cjs",
        exports: "auto",
      },
    ],
    watch: {
      exclude: "node_modules/**",
    },
    plugins: [
      commonjs(),
      terser(),
      typescript(),
      babel({ exclude: "node_modules/**", babelHelpers: "bundled" }),
    ],
  },
];
