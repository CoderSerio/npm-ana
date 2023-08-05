/* eslint-disable @typescript-eslint/ban-ts-comment */
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import { babel } from "@rollup/plugin-babel";
import typescript from "rollup-plugin-typescript2";
import { resolve } from "path";

const inputPath = resolve(__dirname, "../../src/core/index.ts");
const outputPath = resolve(__dirname, "../../lib/index.js");

export default [
  {
    input: inputPath,
    output: [
      {
        file: outputPath,
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
