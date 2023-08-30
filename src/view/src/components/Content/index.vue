<template>
  <div class="content-box">
    <div id="container"></div>
    <div class="options-bar">
      <div class="top">
        <button @click="printOut">保存为图片</button>
      </div>
      <div class="left">
        <div>这是左侧工具栏</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick, reactive } from "vue";
import "@antv/x6-vue-shape";
import { Export } from "@antv/x6-plugin-export";
import getGraphDataUtils from "./utils";

let graph = ref();

// 处理图相关的的方法
const { Graph, createEdge, createNode, layout } = getGraphDataUtils(graph);
const nodes = reactive([]);
const edges = reactive([]);

/** 导出为图片 */
const printOut = () => {
  graph.value.exportPNG(`依赖分析-${new Date()}`, { padding: 30 });
};

/** 建立和 ws 服务器之间的连接 */
const connectWebSocketServer = () => {
  const ws = new window.WebSocket("ws://localhost:2333");
  ws.onerror = () => {
    console.error("ws connecting failed!!!");
  };
  ws.onopen = () => {
    ws.send("init");
  };
  ws.onmessage = async (msg) => {
    const data = JSON.parse(msg.data);
    console.log(data);
    data?.forEach((dataItem) => {
      nodes.push(
        createNode(
          dataItem.name,
          dataItem.version,
          dataItem.description,
          dataItem?.id === 0 ? "root-node" : undefined
        )
      );
    });
    data?.forEach((dataItem) => {
      console.log(dataItem?.name, dataItem?.id, dataItem?.dependencies);
      dataItem?.dependencies?.forEach((depId) => {
        if (![dataItem?.id, depId].includes(undefined)) {
          edges.push(createEdge(nodes[dataItem.id], nodes[depId]));
        }
      });
    });
    // 再遍历一遍算了
    graph.value.resetCells([...nodes, ...edges]);
    layout();
  };
};

onMounted(async () => {
  const container = document.getElementById("container") as HTMLElement;
  graph.value = new Graph({
    container,
    width: container.scrollWidth || 1500,
    height: (container.scrollHeight || 500) - 20,
    autoResize: true,
    panning: {
      enabled: true,
    },
    background: {
      color: "#333",
    },
  });

  // [createNode("这是目录名字", "", "", "root-node")].forEach((node) =>
  //   nodes.push(node)
  // );

  // https://x6.antv.antgroup.com/tutorial/plugins/scroller
  graph.value.use(new Export());

  const cell = graph.value.getCells()[0];
  if (cell) {
    graph.value.centerCell(cell);
  }

  connectWebSocketServer();
  // graph.value.drawBackground({ color: "#999999" }); // 创建画布后也可调用方法重绘背景
  // graph.value.drawGrid({ type: "mesh" }); // 创建画布后也可调用方法重绘画布网格
  // graph.value.zoom(0.5); // 画布和图形整体的缩放
  // graph.value.translate(0, -3000); // 图形相对画布的相对位置，平移
  // graph.value.centerContent(); // 将画布内容中心与视口中心对齐
});
</script>

<style scoped lang="scss">
.content-box {
  position: absolute;
  height: 100vh;
  width: 100vw;
  #container {
    width: 100%;
    height: 100%;
  }
  .options-bar {
    .top {
      position: fixed;
      top: 20px;
      right: 20px;
      height: 60px;
      width: calc(100vw - 350px);
      /* background-color: #fffe; */
      display: flex;
      justify-content: flex-end;
      border-radius: 12px;
    }

    .left {
      position: fixed;
      height: calc(100vh - 32px);
      width: 300px;
      left: 20px;
      top: 20px;
      background-color: #fffe;
      border-radius: 12px;
    }
  }
}
</style>
