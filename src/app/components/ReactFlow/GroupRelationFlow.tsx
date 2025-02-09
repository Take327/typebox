"use client";

import { useMemo } from "react";
import ReactFlow, { Background, Controls, Edge, Node } from "reactflow";
import "reactflow/dist/style.css";

// 事前に定義した座標と相性データをインポート
import { MBTI_COORDS, mbtiRelations } from "@/utils/mbti/Compatibility";
import MbtiNode from "./MbtiNode";

/** MBTIタイプをすべて列挙 */
const ALL_MBTI_TYPES = [
  "ENTP",
  "ISFP",
  "ESFJ",
  "INTJ",
  "INTP",
  "ESFP",
  "ISFJ",
  "ENTJ",
  "ISTP",
  "ENFP",
  "INFJ",
  "ESTJ",
  "ESTP",
  "INFP",
  "ENFJ",
  "ISTJ",
];

/** ユーザー情報（ダミー） */
type Member = {
  id: number;
  user_name: string;
  mbti_type: string;
};

const dummyMembers: Member[] = [
  { id: 1, user_name: "Alice", mbti_type: "ENTP" },
  { id: 2, user_name: "Bob", mbti_type: "ISFP" },
];

/** スコアに応じてエッジの色を変える */
function getEdgeColor(score: number): string {
  switch (score) {
    case 4:
      return "#FFB6C1"; // Best
    case 3:
      return "#ADD8E6"; // Better
    case 2:
      return "#98FB98"; // Good
    case 1:
      return "#000000"; // Bad
    default:
      return "#CCCCCC"; // 未定義
  }
}

/**
 * ノードを生成
 * - MBTIごとにメンバーをまとめてノード化
 * - 事前に定義した座標 (MBTI_COORDS) を使用
 */
function createNodes(members: Member[]) {
  // MBTIごとにユーザー名をまとめる
  const grouped: Record<string, string[]> = {};
  ALL_MBTI_TYPES.forEach((type) => {
    grouped[type] = [];
  });

  // ユーザーを MBTI 別に振り分け
  members.forEach((m) => {
    const upper = m.mbti_type.toUpperCase();
    if (grouped[upper]) {
      grouped[upper].push(m.user_name);
    }
  });

  // ノード配列を生成
  const nodes: Node[] = ALL_MBTI_TYPES.map((type) => {
    const coords = MBTI_COORDS[type] || { x: 0, y: 0 };
    return {
      id: type,
      position: coords,
      type: "mbtiNode",
      data: {
        mbti: type,
        members: grouped[type],
      },
      draggable: false,
      selectable: false,
    };
  });

  return nodes;
}

/**
 * ノード間の座標を比較し、エッジの `sourceHandle` / `targetHandle` を決定
 */
function getHandlesForEdge(source: string, target: string): { sourceHandle: string; targetHandle: string } {
  const sCoord = MBTI_COORDS[source] ?? { x: 0, y: 0 };
  const tCoord = MBTI_COORDS[target] ?? { x: 0, y: 0 };

  const dx = tCoord.x - sCoord.x;
  const dy = tCoord.y - sCoord.y;

  if (dx === 0 && dy === 0) return { sourceHandle: "source-right", targetHandle: "target-left" }; // 自己接続回避

  // **希望のエッジ (ENTP → INTJ) を特別設定**
  if (source === "ENTP" && target === "INTJ") {
    return { sourceHandle: "source-right", targetHandle: "target-left" }; // ENTP の右 → INTJ の左
  }

  // ** 斜めのエッジ (↘ ↙ ↗ ↖) **

  // ** 横方向のエッジ **
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx > 0
      ? { sourceHandle: "source-right", targetHandle: "target-left" } // →
      : { sourceHandle: "source-left", targetHandle: "target-right" }; // ←
  }

  // ** 縦方向のエッジ **
  return dy > 0
    ? { sourceHandle: "source-Bottom", targetHandle: "target-Top" } // ↓
    : { sourceHandle: "source-Top", targetHandle: "target-Bottom" }; // ↑
}

/**
 * エッジを生成
 * - `type: "straight"` を指定することで、斜めのエッジも直線で描画可能にする
 */
function createEdges() {
  const edgeList: Edge[] = [];

  Object.entries(mbtiRelations).forEach(([source, targets]) => {
    Object.entries(targets).forEach(([target, score]) => {
      // `sourceHandle` / `targetHandle` を取得
      const { sourceHandle, targetHandle } = getHandlesForEdge(source, target);

      edgeList.push({
        id: `e-${source}-${target}`,
        source,
        target,
        label: score === 4 ? "Best" : score === 3 ? "Better" : score === 2 ? "Good" : "Bad",
        animated: true,

        // **直線 (`straight`) を使用して、斜めのエッジを描画**
        type: "straight",

        sourceHandle,
        targetHandle,
        style: { stroke: getEdgeColor(score), strokeWidth: 2 },
      });
    });
  });

  return edgeList;
}

/** MBTIノード＋エッジを描画するコンポーネント */
export default function GroupRelationFlow() {
  // ノードを作る
  const nodes = useMemo(() => createNodes(dummyMembers), []);

  // エッジを作る
  const edges = useMemo(() => createEdges(), []);

  return (
    <div style={{ width: "100%", height: "800px", border: "1px solid #ccc" }}>
      <h3 className="text-center font-bold mb-2">MBTI相関図（上下左右ハンドル対応）</h3>
      <ReactFlow nodeTypes={{ mbtiNode: MbtiNode }} nodes={nodes} edges={edges} fitView>
        <Background gap={12} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
