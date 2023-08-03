// 用于校验是否使用 pnpm 8+
const child_process = require("child_process");

let version;
try {
  version = child_process.execSync("pnpm -v").toString();
} catch (err) {
  console.error(`Error: can't find module 'pnpm'.`);
  process.exit(1);
}

const majorVersion = version?.split(".")?.[0];
if (!majorVersion || +majorVersion < 8) {
  console.error(
    `Error: required pnpm version is not less than 8.0.0, but got ${version}.`
  );
  process.exit(1);
}
