import * as fs from "fs";
import * as path from "path";
const data = {
    name: 'John',
    age: 30
  };
// TODO: 读取依赖
export const analyzeDependencies = () => {};

// TODO: 生成 JSON 文件
export const generateJsonReport = (jsonPath:string) => {
    const jsonData = JSON.stringify(data, null, 2); 
    const fileDirPath = path.join(__dirname,"../",path.dirname(jsonPath)); // 设置路径
    const filePath = path.join(__dirname,"../",jsonPath); // 设置路径
    if (!fs.existsSync(fileDirPath)) {
      console.log("文件夹不存在,创建文件夹");
      fs.mkdirSync(fileDirPath, { recursive: true });
      // 创建目录（如果目录不存在）
    }
    fs.writeFile(filePath, jsonData, 'utf8', (err) => {
        if (err) {
          console.error('生成json文件错误', err);
        } else {
          console.log('生成json文件成功');
        }
      });
      
};
