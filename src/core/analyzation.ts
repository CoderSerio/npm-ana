import * as fs from "fs";
import * as path from "path";

/** 所有packages路径的集合 */
const index2path: Array<string> = [];
const path2index: Record<string, number> = {};
const path2name: Record<string, string> = {};
/** 分类：同名包分到一类。如果一个包的路径数量>1，那么我们需要寻找其中路径最近的一个即可 */
const name2PathList: Record<string, Array<string>> = {};
/** 依赖树（邻接表的样子） */
const dependencyAdjacencyList: Array<Array<number>> = [];

/** 安全读取package.json */
const readPackageInfoSync = (fileItemPath: string) => {
  const pkgInfoJson = fs.readFileSync(fileItemPath)?.toString() ?? "";
  const pkgInfo = JSON.parse(pkgInfoJson);
  return pkgInfo;
};

/** 获取命令执行的目录位置 */
const getClosestCommandTargetPath = () => {
  let currentPath = process.cwd();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const dirs = fs.readdirSync(currentPath);
    if (dirs.includes("node_modules")) {
      break;
    } else {
      currentPath = path.resolve(currentPath, "..");
      if (currentPath.match(/\w:\\/)) {
        console.log("没有找到node_modules");
        return;
      }
    }
  }

  return currentPath;
};

/** 返回前端需要的依赖信息 */
export const getPackageInfoByIndex = (index: number) => {
  const pkgPath = index2path[index];
  const pkgInfo = readPackageInfoSync(pkgPath);

  console.log(dependencyAdjacencyList[index]);

  // TODO: 文件大小等
  return {
    id: index,
    name: pkgInfo.name,
    version: pkgInfo.version,
    description: pkgInfo.description,
    dependencies: dependencyAdjacencyList[index],
  };
};

/** 获取所有package.json的绝对路径 */
const nodeModulesDFS = (entryDirPath: string) => {
  const fileItemList = fs.readdirSync(entryDirPath, { withFileTypes: true });

  fileItemList?.forEach((fileItem) => {
    const fileItemPath = path.join(entryDirPath, fileItem.name);
    if (fileItem.name === "package.json") {
      // 记录各种索引
      index2path.push(fileItemPath);
      path2index[fileItemPath] = index2path.length - 1;

      const pkgInfo = readPackageInfoSync(fileItemPath);
      path2name[fileItemPath] = pkgInfo.name;

      if (name2PathList[pkgInfo.name] instanceof Array) {
        name2PathList[pkgInfo.name].push(fileItemPath);
      } else {
        name2PathList[pkgInfo.name] = [];
        name2PathList[pkgInfo.name].push(fileItemPath);
      }
    } else if (fileItem.isDirectory()) {
      // 启用尾递归，防止内存溢出
      return nodeModulesDFS(fileItemPath);
    }
  });
};

/** 一个包可能有多个路径，选择正确的依赖路径 */
const getDependentPath = (currentPath: string, pkgName: string) => {
  // console.log("name2PathList", pkgName, name2PathList);
  const pkgPaths = name2PathList[pkgName];

  if (!pkgPaths?.length) {
    return "";
  } else if (pkgPaths.length === 1) {
    return pkgPaths[0];
  } else {
    /* 
      1. 检查当前目录下的node_modules中有没有这个包
      2. 如果没有, 那么找扁平化的层级————即找路径长度最短的一个即可
    */
    for (const pkgPath of pkgPaths) {
      if (pkgPath.search(currentPath) !== -1) {
        return pkgPath;
      }
    }
    pkgPaths.sort((a, b) => b.length - a.length);
    return pkgPaths[0];
  }
};

/** 构建依赖邻接表 */
const buildDependencyAdjacencyList = () => {
  index2path?.forEach((path) => {
    const dependenciesIndexList: Array<number> = [];
    const pkgInfo = readPackageInfoSync(path);
    const dependencies = pkgInfo.dependencies;

    for (const pkgName in dependencies) {
      const pkgPath = getDependentPath(path, pkgName);

      const pkgIndex = path2index[pkgPath];
      if (pkgIndex !== undefined) {
        dependenciesIndexList.push(pkgIndex);
      }
    }

    dependencyAdjacencyList.push(dependenciesIndexList);
  });
};

export const analyzeDependencies = () => {
  // 在遍历之前，把当前包的信息放入数组，完成初始化
  const currentPath = getClosestCommandTargetPath() as string;
  const nodeModulesEntryPath = path.resolve(currentPath, "node_modules");
  const rootPackageJsonPath = path.join(currentPath, "package.json");
  index2path.push(rootPackageJsonPath);
  path2index[rootPackageJsonPath] = index2path.length - 1;
  const pkgInfo = readPackageInfoSync(rootPackageJsonPath);
  path2name[rootPackageJsonPath] = pkgInfo.name;

  nodeModulesDFS(nodeModulesEntryPath);
  buildDependencyAdjacencyList();

  return dependencyAdjacencyList;
};

export const generateJsonReport = (jsonPath: string, data = "") => {
  const jsonData = JSON.stringify(data, null, 2);
  const fileDirPath = path.join(__dirname, "../", path.dirname(jsonPath)); // 设置路径
  const filePath = path.join(__dirname, "../", jsonPath); // 设置路径
  if (!fs.existsSync(fileDirPath)) {
    console.log("文件夹不存在,创建文件夹");
    fs.mkdirSync(fileDirPath, { recursive: true });
  }
  fs.writeFile(filePath, jsonData, "utf8", (err) => {
    if (err) {
      console.error("生成json文件错误", err);
    } else {
      console.log("生成json文件成功");
    }
  });
};
