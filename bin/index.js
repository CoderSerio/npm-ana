#!/usr/bin/env node

const ANA = require("../lib/index.js");
const pkg = require("../package.json");
const commander = require("commander");

const programer = commander
  .version(pkg.version)
  .usage(
    `ana-cli
    来感受一下次世代的 npm 依赖分析工具的威力！
    Arguments:
      xxx1  开发中.
      xxx2  开发中.`
  )
  .option(
    "-D, --depth <depth>",
    "指定搜索深度（TODO: 之后完善一下文案），传入负数则遍历所有",
    -1
  )
  .option("--json <path>", "生成json文件，并指定输出路径")
  .option("-P, --port <port>", "指定服务器端口", 2333)
  .parse(process.argv);

const props = programer.opts();

ANA(props);
