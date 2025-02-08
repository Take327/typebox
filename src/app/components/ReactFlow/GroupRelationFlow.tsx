"use client";

import React, { useMemo, useCallback, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
} from "reactflow";
import "reactflow/dist/style.css";
import MbtiNode from "./MbtiNode";

type Member = {
  id: number;
  user_name: string;
  mbti_type: string;
};

type RelationEdge = {
  id: string;
  source: string;
  target: string;
  label: "Best" | "Better" | "Good" | "Bad"; // 型定義を厳密化
};

/** エッジのラベルごとのスタイル定義 */
const edgeStyles: Record<RelationEdge["label"], { stroke: string }> = {
  Best: { stroke: "#ffb6c1" }, // ピンク系パステル
  Better: { stroke: "#add8e6" }, // 青系パステル
  Good: { stroke: "#98fb98" }, // 緑系パステル
  Bad: { stroke: "#000000" }, // 黒
};

interface GroupRelationFlowProps {
  members: Member[];
  initialEdges?: RelationEdge[];
}

export default function GroupRelationFlow({ members, initialEdges = [] }: GroupRelationFlowProps) {
  console.log("メンバー:", members);
  console.log("エッジ:", initialEdges);

  const initialNodes: Node[] = useMemo(() => {
    return members.map((m, index) => ({
      id: m.id.toString(),
      position: { x: (index % 3) * 250, y: Math.floor(index / 3) * 150 },
      type: "mbtiNode",
      data: { label: m.user_name, mbti: m.mbti_type },
    }));
  }, [members]);

  const initialEdgesData: Edge[] = useMemo(() => {
    return initialEdges.map((e) => ({
      id: e.id,
      source: e.source.toString(),
      target: e.target.toString(),
      label: e.label,
      animated: true,
      type: "smoothstep",
      style: { strokeWidth: 3, stroke: edgeStyles[e.label].stroke }, // ✅ 色を適用
    }));
  }, [initialEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes]);

  useEffect(() => {
    setEdges(initialEdgesData);
  }, [initialEdgesData]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  const nodeTypes = useMemo(() => ({ mbtiNode: MbtiNode }), []);

  return (
    <div style={{ width: "100%", minHeight: "600px", border: "1px solid #ccc" }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
