import { startServer } from "./server";

interface ANAProps {
  depth: number | string;
  port: number | string;
  json?: string;
}

/**
 * ana 函数，整个包的核心处理逻辑都在这里
 * 可以理解为，它相当于c语言的 main
 * 从 bin/index.js 获取参数
 *
 * @params props { depth: number, json?: string, port?: number }
 */
const ANA = (props: ANAProps) => {
  const currentPath = process.cwd();
  console.log("ANA, 启动！", props);
  console.log("当前位置：", currentPath);

  startServer();
  // startFrontEnd();
};

export default ANA;
