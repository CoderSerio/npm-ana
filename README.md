# NPM-ANA [临时名称，征求一个好名字]
## 

## 需求

具体内容见 [PRD](https://uestc.feishu.cn/docx/PdJadI4gzopOvaxJyMucN3noned)。

## 基本开发流程

### 安装依赖

这里我们限制使用 pnpm 8+ 进行开发：

```shell
# 如果已经安装过pnpm 8+了，那么请忽略这一步
npm i pnpm -g

pnpm i
```

### 开发包

暂时先采用 `link` 的形式进行开发，后面有空了改成 `yalc` 等调试方式：

```shell
# 打包核心模块生成产物 (lib/index.js 等)
pnpm build-core

# 和当前包建立关联（这里不知道为什么，pnpm 可能会报错，所以改用 npm）
npm link

# 输入命令观察是否生效
ana-cli
```

### 开发前端

```shell
# 启动 vite 服务器
pnpm dev
```

### 开发计划

- [] 全局安装，获取使用命令时的路径，找到最近的 node_modules

- [] 初步读取 node_modules

- [] 启动服务器，为前端提供数据接口

- [] 完成前端基本内容

