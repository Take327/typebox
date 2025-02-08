"use client"; // クライアントコンポーネント必須

import React, { useState, useCallback } from "react";
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";

// 初期ノードとエッジのサンプル
const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: "Member A" },
  },
  {
    id: "2",
    position: { x: 200, y: 100 },
    data: { label: "Member B" },
  },
];
const initialEdges: Edge[] = [{ id: "e1-2", source: "1", target: "2", label: "相性良" }];

export default function GroupRelationFlow() {
  // ノードとエッジをステート管理
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // ドラッグ＆ドロップで新規エッジを追加
  const onConnect = useCallback((params: Edge | any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div style={{ width: "100%", height: 400, border: "1px solid #ccc" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
