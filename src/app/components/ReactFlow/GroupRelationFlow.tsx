"use client";
import { GroupMember } from "@/types";
import { MBTI_COORDS, mbtiRelations } from "@/utils/mbti/Compatibility";
import { useEffect, useState } from "react";
import ReactFlow, { Background, Controls, Edge, Node } from "reactflow";
import "reactflow/dist/style.css";
import MbtiNode from "./MbtiNode";

const MBTI_MATRIX = [
  ["ENTP", "ISFP", "ISTP", "ENFP"],
  ["ESFJ", "INTJ", "INFJ", "ESTJ"],
  ["INTP", "ESFP", "ESTP", "INFP"],
  ["ISFJ", "ENTJ", "ENFJ", "ISTJ"],
];

// ベースの高さやスケールを微調整
const BASE_ROW_HEIGHT = 150;
const MEMBERS_SCALE = 20; // メンバー数が1人増えるごとに何px下に伸ばすか
const COL_WIDTH = 220; // 列の幅

/** スコアに応じてエッジの色を変える */
function getEdgeColor(score: number): string {
  switch (score) {
    case 4:
      return "#FAD4E0"; // Best
    case 3:
      return "#81D8D0"; // Better
    case 2:
      return "#F6CEB4"; // Good
    case 1:
      return "#CDE7F4"; // Bad
    default:
      return "#CCCCCC"; // 未定義
  }
}

/** 同じ行にある MBTI のメンバー数の最大値を計算して、行の高さを決める */
function computeRowHeights(grouped: Record<string, string[]>): number[] {
  const rowHeights: number[] = [];

  MBTI_MATRIX.forEach((rowMbti, rowIndex) => {
    // この行に属するMBTIタイプそれぞれのメンバー数
    const counts = rowMbti.map((type) => grouped[type].length);
    const maxMembers = Math.max(...counts); // この行の最大メンバー数
    // 行の高さ = ベース + (最大メンバー数 * スケール)
    const rowHeight = BASE_ROW_HEIGHT + maxMembers * MEMBERS_SCALE;
    rowHeights[rowIndex] = rowHeight;
  });

  return rowHeights;
}

/** 行の高さの累積和を計算して、行のベースY座標を求める */
function computeRowOffsets(rowHeights: number[]): number[] {
  const offsets: number[] = [0]; // row 0 は offset 0
  for (let i = 1; i < rowHeights.length; i++) {
    offsets[i] = offsets[i - 1] + rowHeights[i - 1];
  }
  return offsets;
}

/**
 * ノードを作成する関数
 * - 各 MBTI タイプに基づいて、4×4配置
 * - 行ごとの高さを可変にして、重ならないようにする
 */
function createNodes(members: GroupMember[]): Node[] {
  // --- 1) MBTIごとにメンバーを振り分け ---
  const grouped: Record<string, string[]> = {};
  MBTI_MATRIX.flat().forEach((type) => {
    grouped[type] = [];
  });

  // ユーザーを MBTI 別に振り分け
  members.forEach((m) => {
    const upper = m.mbti_type?.toUpperCase();
    if (upper && grouped[upper]) grouped[upper].push(m.user_name);
  });

  // --- 2) 行ごとの高さとオフセットを計算 ---
  const rowHeights = computeRowHeights(grouped);
  const rowOffsets = computeRowOffsets(rowHeights);

  // --- 3) 各MBTIタイプに対応するノードを配置 ---
  const nodes: Node[] = [];
  MBTI_MATRIX.forEach((rowMbti, rowIndex) => {
    // この行のベースY
    const baseY = rowOffsets[rowIndex];

    rowMbti.forEach((type, colIndex) => {
      // x座標は列に応じて固定幅をかける
      const xPos = colIndex * COL_WIDTH;
      // y座標は行のオフセット + (事前に定義した baseline)
      // さらに MBTIごとの初期座標があるなら適宜加算しても良い
      const originalCoords = MBTI_COORDS[type] || { x: 0, y: 0 };
      // 例: originalCoords.y は無視して、rowOffsetsに任せるか、加算してもOK
      const yPos = baseY; // + (originalCoords.y) → 必要なら加算

      // データに複数メンバーを持たせる（ノードは1つだけ）
      nodes.push({
        id: type, // エッジ接続のために MBTIタイプ名をそのままIDに
        position: { x: xPos, y: yPos },
        type: "mbtiNode",
        data: { mbti: type, members: grouped[type] },
        draggable: false,
        selectable: false,
      });
    });
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

  if (source === "ENTP" && target === "ISFJ") {
    return { sourceHandle: "source-left", targetHandle: "target-left" }; // ENTP の右 → INTJ の左
  }
  if (source === "ISTP" && target === "ENFJ") {
    return { sourceHandle: "source-left", targetHandle: "target-left" }; // ENTP の右 → INTJ の左
  }

  if (source === "ISFP" && target === "ENTJ") {
    return { sourceHandle: "source-right", targetHandle: "target-right" }; // ENTP の右 → INTJ の左
  }

  if (source === "ENFP" && target === "ISTJ") {
    return { sourceHandle: "source-right", targetHandle: "target-right" }; // ENTP の右 → INTJ の左
  }

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
 * エッジのパスの種類を決定
 * - `ENTP → ISFJ` の場合、必ず `"step"` を適用
 * - それ以外は通常のロジックで `"straight"` または `"step"`
 */
function getEdgePathType(source: string, target: string): string {
  // ENTP → ISFJ の場合、コの字型を適用
  if (source === "ENTP" && target === "ISFJ") {
    return "step"; // **強制的にコの字型**
  }

  if (source === "ISFP" && target === "ENTJ") {
    return "step"; // **強制的にコの字型**
  }

  if (source === "ISTP" && target === "ENFJ") {
    return "step"; // **強制的にコの字型**
  }

  if (source === "ENFP" && target === "ISTJ") {
    return "step"; // **強制的にコの字型**
  }

  const sCoord = MBTI_COORDS[source] ?? { x: 0, y: 0 };
  const tCoord = MBTI_COORDS[target] ?? { x: 0, y: 0 };

  const dx = Math.abs(tCoord.x - sCoord.x);
  const dy = Math.abs(tCoord.y - sCoord.y);

  // 横方向のエッジは直線
  if (dy === 0) return "straight";

  // 斜めのエッジはU字型 (step)
  return "straight"; // 斜めや縦方向は `step` で描画
}

/**
 * エッジを生成
 * - `"step"` を適用することで、コの字型 (直角に曲がる) エッジを描画
 */
function createEdges() {
  const edgeList: Edge[] = [];

  Object.entries(mbtiRelations).forEach(([source, targets]) => {
    Object.entries(targets).forEach(([target, score]) => {
      // `sourceHandle` / `targetHandle` を取得
      const { sourceHandle, targetHandle } = getHandlesForEdge(source, target);
      const edgeType = getEdgePathType(source, target); // 直線 or コの字型を判定

      edgeList.push({
        id: `e-${source}-${target}`,
        source,
        target,
        label: score === 4 ? "Best" : score === 3 ? "Better" : score === 2 ? "Good" : "Bad",
        animated: true,

        // **特定のエッジは「コの字型 (step)」で描画**
        type: edgeType,

        sourceHandle,
        targetHandle,
        style: { stroke: getEdgeColor(score), strokeWidth: 2 },
      });
    });
  });

  return edgeList;
}
/** MBTIノード＋エッジを描画するコンポーネント */
export default function GroupRelationFlow({ members }: { members: GroupMember[] }) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // メンバーが変更されたときにノード・エッジを更新
  useEffect(() => {
    setNodes(createNodes(members));
    setEdges(createEdges());
  }, [members]);

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
