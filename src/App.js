import React, { useCallback, useRef } from "react";

import ReactFlow, {
  addEdge,
  MarkerType,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  updateEdge,
} from "reactflow";

import CustomNode from "./CustomNode";
import CustomConnectionLine from "./CustomConnectionLine";
import dagre from "dagre";
import { useStore, getSmoothStepPath } from "reactflow";
import "./style.css";
import { getEdgeParams } from "./utils.js";
import "reactflow/dist/style.css";
import EditorHorizontalRuleIcon from "@atlaskit/icon/glyph/editor/horizontal-rule";
import "./style.css";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 172;
const nodeHeight = 36;

const initialNodes = [
  {
    id: "1",
    type: "custom",
    data: { label: "Node B" },
  },
  {
    id: "2",
    type: "custom",
  },
  {
    id: "3",
    type: "custom",
  },
  {
    id: "4",
    type: "custom",
  },
];
const initialEdges = [
  { id: "2", source: "1", target: "2" },
  { id: "3", source: "1", target: "3" },
  { id: "4", source: "1", target: "4" },
];

const connectionLineStyle = {
  strokeWidth: 1,
  stroke: "black",
};

const nodeTypes = {
  custom: CustomNode,
};

const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? "left" : "top";
    node.sourcePosition = isHorizontal ? "right" : "bottom";

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

const defaultEdgeOptions = {
  style: { strokeWidth: 1, stroke: "black" },
  type: "floating",

  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "black",
  },
};
const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  initialNodes,
  initialEdges
);

const EasyConnectExample = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  console.log(edges);
  const edgeUpdateSuccessful = useRef(true);

  // const onConnect = useCallback(
  //   (params) => setEdges((eds) => addEdge(params, eds)),
  //   [setEdges]
  // );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, label: "x" }, eds)),
    [setEdges]
  );
  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);

  function FloatingEdge({ id, source, target, markerEnd, style }) {
    const sourceNode = useStore(
      useCallback((store) => store.nodeInternals.get(source), [source])
    );
    const targetNode = useStore(
      useCallback((store) => store.nodeInternals.get(target), [target])
    );
    const foreignObjectSize = 40;
    if (!sourceNode || !targetNode) {
      return null;
    }

    const onEdgeClick = (evt, id) => {
      evt.stopPropagation();
      const edgeIndex = edges.findIndex((edge) => edge.id === id);
      const updatedEdges = [...edges];
      updatedEdges.splice(edgeIndex, 1);
      setEdges(updatedEdges);
    };

    const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);
    const [edgePath, labelX, labelY] = getSmoothStepPath({
      sourceX: sx,
      sourceY: sy,
      targetX: tx,
      targetY: ty,
    });

    return (
      <>
        {" "}
        <path
          id={id}
          className="react-flow__edge-path"
          d={edgePath}
          markerEnd={markerEnd}
          style={style}
        />
        <foreignObject
          width={foreignObjectSize}
          height={foreignObjectSize}
          x={labelX - foreignObjectSize / 5}
          y={labelY - foreignObjectSize / 5}
          className="edgebutton-foreignobject"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div
            className="edgebutton"
            onClick={(event) => onEdgeClick(event, id)}
          >
            <div className="minus-icon">-</div>
          </div>
        </foreignObject>
      </>
    );
  }

  const edgeTypes = {
    floating: FloatingEdge,
  };

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);

  return (
    <div className="layoutflow" style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineComponent={CustomConnectionLine}
        connectionLineStyle={connectionLineStyle}
        snapToGrid
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        connectionLineType={ConnectionLineType.SmoothStep}
      />
    </div>
  );
};

export default EasyConnectExample;
