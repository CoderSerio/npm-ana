import * as http from "http";
import * as childProcess from "child_process";
// import { resolve } from "path";

// TODO: 传入端口等参数
export const startServer = async () => {
  const port = 2333;
  const server = http.createServer((req, res) => {
    console.log(req);
    console.log("dir", __dirname);
    // const htmlFilePath = resolve(, '')
    res.end("Hello");
  });

  server.listen(port, () => {
    console.log(`服务器已经在${port}上开启`);
    childProcess.exec(`start http://localhost:${port}`);
  });
};

// export const startFrontEnd = async () => {
//   console.log("前端已启动");
//   childProcess.execSync("npm dev");
// };
