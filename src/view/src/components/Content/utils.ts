import { Cell, Dom, Graph } from "@antv/x6";
import dagre from "dagre";

/** Graph 工厂函数 */
const GraphFactory = () => {
  Graph.registerNode(
    "root-node", // 自定义节点名
    {
      id: "oneTitle",
      width: 180,
      height: 80,
      attrs: {
        body: {
          width: 180,
          height: 80,
          rx: 4, // 圆角矩形
          ry: 4,
          strokeWidth: 0,
          fill: "#15ac8a",
        },
        ".oneTitle": {
          refX: 90,
          refY: 40,
          fill: "#ffffff",
          fontSize: 15,
          fontWeight: 800,
          textAnchor: "middle",
          textVerticalAnchor: "middle",
        },
      },
      markup: [
        {
          tagName: "rect",
          selector: "body",
        },
        {
          tagName: "text",
          selector: "title",
        },
        {
          tagName: "text",
          selector: "text",
        },
        {
          tagName: "text",
          attrs: {
            class: "oneTitle",
          },
        },
      ],
    },
    true // 重名时是否覆盖
  );
  // 自定义节点
  Graph.registerNode(
    "common-node", // 自定义节点名
    {
      width: 180,
      height: 80,
      attrs: {
        body: {
          width: 180,
          height: 80,
          rx: 4, // 圆角矩形
          ry: 4,
          strokeWidth: 0,
          fill: "pink",
        },
        ".oneTitle": {
          refX: 90,
          refY: 40,
          fill: "rgba(0,0,0,0.85)",
          fontSize: 15,
          fontWeight: 800,
          textAnchor: "middle",
          textVerticalAnchor: "middle",
        },
        title: {
          refX: 10,
          refY: 15,
          fill: "rgba(0,0,0,0.85)",
          fontSize: 15,
          fontWeight: 800,
          "text-anchor": "start",
        },
        text: {
          refX: 10,
          refY: 35,
          fontSize: 14,
          fill: "rgba(0,0,0,0.6)",
          "text-anchor": "start",
        },
        ".date": {
          refX: 10,
          refY: 55,
          fontSize: 14,
          fill: "rgba(0,0,0,0.6)",
          "text-anchor": "start",
        },
      },
      markup: [
        {
          tagName: "rect",
          selector: "body",
        },
        {
          tagName: "image",
          selector: "image",
        },
        {
          tagName: "text",
          selector: "title",
        },
        {
          tagName: "text",
          selector: "text",
        },
        {
          tagName: "text",
          attrs: {
            class: "date",
          },
        },
        {
          tagName: "text",
          attrs: {
            class: "oneTitle",
          },
        },
      ],
    },
    true // 重名时是否覆盖
  );

  // 自定义边
  Graph.registerEdge(
    "org-edge", // 自定义边名
    {
      zIndex: -1,
      attrs: {
        line: {
          fill: "none",
          strokeLinejoin: "round",
          strokeWidth: 2,
          stroke: "#A2B1C3",
        },
      },
    },
    true // 重名时是否覆盖
  );

  return Graph;
};

/** 创建节点 */
const createNode = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  graph,
  title?: string,
  text?: string,
  date?: string,
  bgc?: string
) => {
  return graph?.value?.createNode({
    shape: bgc ?? "common-node",
    attrs: {
      title: {
        text: Dom.breakText(title as string, { width: 160, height: 20 }),
      },
      text: {
        text: Dom.breakText(text as string, { width: 160, height: 18 }),
      },
      ".date": {
        text: Dom.breakText(date as string, { width: 160, height: 18 }),
      },
    },
  });
};

/** 创建连接线 */
const createEdge = (graph, source: Cell, target: Cell) => {
  return graph.value.createEdge({
    shape: "org-edge",
    source: { cell: source.id },
    target: { cell: target.id },
  });
};

/** 自动布局 */
const layout = (graph) => {
  const nodes = graph.value.getNodes();
  const edges = graph.value.getEdges();
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "TB", nodesep: 16, ranksep: 16 });
  g.setDefaultEdgeLabel(() => ({}));

  const width = 260;
  const height = 130;
  nodes.forEach((node: { id }) => {
    g.setNode(node.id, { width, height });
  });

  edges.forEach((edge) => {
    const source = edge.getSource();
    const target = edge.getTarget();
    g.setEdge(source.cell, target.cell);
  });

  dagre.layout(g);
  // graph.value.freeze();

  g.nodes().forEach((id) => {
    const node = graph.value.getCellById(id);
    if (node) {
      const pos = g.node(id);
      node?.position(pos.x, pos.y);
    }
  });

  edges.forEach(
    (edge: {
      getSourceNode;
      getTargetNode;
      setVertices: (arg0: { x; y }[]) => void;
    }) => {
      const source = edge.getSourceNode()!;
      const target = edge.getTargetNode()!;
      const sourceBBox = source.getBBox();
      const targetBBox = target.getBBox();
      const gap = targetBBox.y - sourceBBox.y - sourceBBox.height;
      const fix = sourceBBox.height;
      const y = sourceBBox.y + fix + gap / 2;
      edge.setVertices([
        { x: sourceBBox.center.x, y },
        { x: targetBBox.center.x, y },
      ]);
    }
  );
};

const getGraphDataUtils = (graph) => {
  const Graph = GraphFactory();
  return {
    Graph,
    createNode: (...params) => createNode(graph, ...params),
    createEdge: (source: Cell, target: Cell) =>
      createEdge(graph, source, target),
    layout: () => layout(graph),
  };
};

export default getGraphDataUtils;
