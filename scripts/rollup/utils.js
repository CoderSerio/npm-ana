import path from "path";
import fs from "fs";

import ts from "rollup-plugin-typescript2";
import cjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";

const pkgPath = path.resolve(__dirname, "../../packages");
const distPath = path.resolve(__dirname, "../../dist/node_modules");

export const resolvePkgPath = (pkgName, isDist) => {
  if (isDist) {
    return `${distPath}/${pkgName}`;
  }
  return `${pkgPath}/${pkgName}`;
};

/** 获取一个包的 package.json */
export const getPackageJSON = (pkgName) => {
  // 包的路径
  const path = `${resolvePkgPath(pkgName)}/package.json`;
  const json = fs.readFileSync(path, { encoding: "utf-8" });
  return JSON.parse(json);
};

export const getBaseRollupPlugins = ({
  alias = {
    /** 开发环境专属标记 */
    __DEV__: true,
    preventAssignment: true,
  },
  tsConfig = {},
}) => {
  return [replace(alias), cjs(), ts(tsConfig)];
};
