import * as http from "http";
import * as childProcess from "child_process";

// TODO: 传入端口等参数
export const startServer = async () => {
  const port = 2333;
  const server = http.createServer(() => {});

  server.listen(port, () => {
    console.log(`服务器已经在${port}上开启`);
  });
};

export const startFrontEnd = async () => {
  console.log("前端已启动");
  childProcess.execSync("npm dev");
};
