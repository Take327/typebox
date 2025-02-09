"use client";

import React, { useMemo } from "react";
import ReactFlow, { Background, MiniMap, Controls, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import MbtiNode from "./MbtiNode";
import { mbtiRelations } from "@/utils/mbti/Compatibility";

// 16種類のMBTIタイプを定義
const ALL_MBTI_TYPES = [
  "ENTP",
  "ISFP",
  "ISTP",
  "ENFP",
  "ESFJ",
  "INTJ",
  "INFJ",
  "ESTJ",
  "INTP",
  "ESFP",
  "ESTP",
  "INFP",
  "ISFJ",
  "ENTJ",
  "ENFJ",
  "ISTJ",
];

/** ユーザー情報 */
type Member = {
  id: number;
  user_name: string;
  mbti_type: string;
};

/** エッジ情報 */
type RelationEdge = {
  source: string;
  target: string;
  label: string;
  id: string;
};

/**
 * MBTIの相性データ (16x16 の組み合わせ)
 * - mbtiCompatibility["ISTJ"]["ENFP"] = "Bad"
 */
const mbtiCompatibility: Record<string, Record<string, string>> = {
  ISTJ: { ENFP: "Bad", ISFJ: "Better", INFJ: "Good", INTJ: "Best" },
  ISFJ: { ENFP: "Better", INFJ: "Best", INTJ: "Good", ISTJ: "Better" },
  INFJ: { ISTP: "Best", ESTJ: "Better", ENFP: "Good", INTJ: "Bad" },
  INTJ: { ESFJ: "Good", INFP: "Better", ISFP: "Best", ISTJ: "Bad" },
  // 他のMBTIタイプを追加...
};

/**
 * 相性ラベルに応じてエッジの色を変える
 */
function getEdgeColor(score: number): string {
  switch (score) {
    case 4:
      return "#FFB6C1"; // ピンク系パステル (Best)
    case 3:
      return "#ADD8E6"; // 青系パステル (Better)
    case 2:
      return "#98FB98"; // 緑系パステル (Good)
    case 1:
      return "#000000"; // 黒 (Bad)
    default:
      return "#CCCCCC"; // 灰色（未知の相性）
  }
}

/** コンポーネントのProps */
interface GroupRelationFlowProps {
  members: Member[];
}

/**
 * 16MBTIノードを整理し、相性データに基づいたエッジを作成
 */
export default function GroupRelationFlow({ members }: GroupRelationFlowProps) {


  // **1. MBTIごとにメンバーをまとめる**
  const membersByType = useMemo(() => {
    const grouped: Record<string, string[]> = {};
    ALL_MBTI_TYPES.forEach((mbti) => (grouped[mbti] = []));
    members.forEach((m) => {
      const type = m.mbti_type.toUpperCase();
      if (grouped[type]) {
        grouped[type].push(m.user_name);
      }
    });
    return grouped;
  }, [members]);

  // **2. ノード生成 (4×4 グリッドレイアウト)**
  const nodes: Node[] = useMemo(() => {
    return ALL_MBTI_TYPES.map((type, index) => {
      const col = index % 4;
      const row = Math.floor(index / 4);
      return {
        id: type,
        position: { x: col * 220, y: row * 150 },
        type: "mbtiNode",
        draggable: false,
        selectable: false,
        data: {
          label: type,
          user_names: membersByType[type].join(", ") || "なし",
        },
      };
    });
  }, [membersByType]);

  // **3. エッジ作成 (相性がある組み合わせのみ)**
  const edges: Edge[] = Object.entries(mbtiRelations).flatMap(([source, relations]) =>
    Object.entries(relations).map(([target, score]) => ({
      id: `e-${source}-${target}`,
      source,
      target,
      label: score === 4 ? "Best" : score === 3 ? "Better" : score === 2 ? "Good" : "Bad",
      animated: true,
      type: "smoothstep",
      style: { stroke: getEdgeColor(score), strokeWidth: 2 },
    }))
  );

  return (
    <div style={{ width: "100%", height: "700px", border: "1px solid #ccc" }}>
      <h3 className="text-center font-bold mb-2">16 MBTIノード / 全組合せエッジ</h3>
      <ReactFlow nodeTypes={{ mbtiNode: MbtiNode }} nodes={nodes} edges={edges} fitView>
        <Background gap={12} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
