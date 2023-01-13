// import React, { useCallback, useRef } from "react";
// import ReactFlow, {
//   addEdge,
//   ConnectionLineType,
//   useNodesState,
//   useEdgesState,
//   updateEdge,
// } from "reactflow";
// import dagre from "dagre";
// import "reactflow/dist/style.css";

// import { initialNodes, initialEdges } from "./nodes-edges.js";

// import "./Index.css";

// const dagreGraph = new dagre.graphlib.Graph();
// dagreGraph.setDefaultEdgeLabel(() => ({}));

// const nodeWidth = 172;
// const nodeHeight = 36;

// const getLayoutedElements = (nodes, edges, direction = "LR") => {
//   const isHorizontal = direction === "LR";
//   dagreGraph.setGraph({ rankdir: direction });

//   nodes.forEach((node) => {
//     dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
//   });

//   edges.forEach((edge) => {
//     dagreGraph.setEdge(edge.source, edge.target);
//   });

//   dagre.layout(dagreGraph);

//   nodes.forEach((node) => {
//     const nodeWithPosition = dagreGraph.node(node.id);
//     node.targetPosition = isHorizontal ? "left" : "top";
//     node.sourcePosition = isHorizontal ? "right" : "bottom";

//     // We are shifting the dagre node position (anchor=center center) to the top left
//     // so it matches the React Flow node anchor point (top left).
//     node.position = {
//       x: nodeWithPosition.x - nodeWidth / 2,
//       y: nodeWithPosition.y - nodeHeight / 2,
//     };

//     return node;
//   });

//   return { nodes, edges };
// };

// const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
//   initialNodes,
//   initialEdges
// );

// const LayoutFlow = () => {
//   const edgeUpdateSuccessful = useRef(true);
//   const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
//   console.log("",edges);

//   const onConnect = useCallback(
//     (params) =>
//       setEdges((eds) =>
//         addEdge(
//           { ...params, type: ConnectionLineType.SmoothStep, animated: true },
//           eds
//         )
//       ),
//     []
//   );

//   const onEdgeUpdateStart = useCallback(() => {
//     edgeUpdateSuccessful.current = false;
//   }, []);

//   const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
//     edgeUpdateSuccessful.current = true;
//     setEdges((els) => updateEdge(oldEdge, newConnection, els));
//   }, []);

//   const onEdgeUpdateEnd = useCallback((_, edge) => {
//     if (!edgeUpdateSuccessful.current) {
//       setEdges((eds) => eds.filter((e) => e.id !== edge.id));
//     }

//     edgeUpdateSuccessful.current = true;
//   }, []);

//   return (
//     <div className="layoutflow" style={{ width: "100%", height: "100vh" }}>
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         snapToGrid
//         onEdgeUpdate={onEdgeUpdate}
//         onEdgeUpdateStart={onEdgeUpdateStart}
//         onEdgeUpdateEnd={onEdgeUpdateEnd}
//         connectionLineType={ConnectionLineType.SmoothStep}
//         fitView
//       />
//     </div>
//   );
// };

// export default LayoutFlow;
