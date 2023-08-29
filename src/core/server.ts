import * as http from "http";
import * as childProcess from "child_process";
import * as path from "path";
import * as fs from "fs";
import { WebSocketServer } from "ws";
import { analyzeDependencies, getPackageInfoByIndex } from "./analyzation";

const extName2FileType: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".svg": "image/svg+xml;charset=utf-8",
  ".html": "text/html;charset=utf8",
  ".js": "application/javascript;charset=utf8",
  ".css": "text/css;charset=utf8",
};

export const startServer = async () => {
  const port = 2333;
  const httpServer = http.createServer((req, res) => {
    let resFilePath = "/index.html";
    if (req.url !== "/") {
      resFilePath = req?.url || "/index.html";
    }
    const extName = path.extname(resFilePath);
    const fileType = extName2FileType[extName] ?? extName2FileType[".html"];

    res.setHeader("content-type", fileType);
    res.on("close", () => {
      console.log("success!");
    });

    const htmlFilePath = path.resolve(__dirname, `../view${resFilePath}`);
    fs.createReadStream(htmlFilePath).pipe(res);
  });

  const dependencyAdjacencyList = analyzeDependencies();
  const pageSize = 10;
  let page = 0;

  const wsServer = new WebSocketServer({ server: httpServer });
  wsServer.on("connection", (ws) => {
    ws.on("message", (msg) => {
      console.log("客户端消息:", msg);
    });

    setInterval(() => {
      const dataSegment: Array<Record<string, number | string>> = [];
      for (
        let i = page * pageSize;
        i < Math.min((page + 1) * pageSize, dependencyAdjacencyList.length);
        i++
      ) {
        const pkgInfo = getPackageInfoByIndex(i);
        dataSegment.push(pkgInfo);
      }
      page++;
      ws.send(JSON.stringify(dataSegment));
    }, 800);
  });

  httpServer.listen(port, () => {
    console.log(__dirname);
    console.log(`服务器已经在${port}上开启`);
    childProcess.exec(`start http://localhost:${port}`);
  });
};
