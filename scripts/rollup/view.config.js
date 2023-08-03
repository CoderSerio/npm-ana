import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import json from "@rollup/plugin-json";
import babel from "@rollup/plugin-babel";

const entry = "src/view/index.tsx";

// babel配置
const babelOptions = {
  presets: ["@babel/preset-env"],
  extensions: [".js", ".jsx", ".ts", ".tsx", ".scss"],
  exclude: "**/node_modules/**",
};

// rollup配置
export default [
  {
    // 入口
    input: entry,
    // 打包信息
    output: [{ filname: "view.js", dir: "lib/", format: "umd" }],
    // 插件配置
    plugins: [resolve(), commonjs(), typescript(), json(), babel(babelOptions)],
  },
];
