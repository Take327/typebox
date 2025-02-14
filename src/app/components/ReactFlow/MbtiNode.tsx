"use client";
import { Handle, Position } from "reactflow";

/**
 * MBTIノードのカスタムコンポーネント
 * - ノードに MBTI タイプ + メンバー一覧を表示
 * - 上下左右のハンドルを配置して、任意の方向からエッジを接続可能
 */
export default function MbtiNode({ data }: { data: { mbti: string; members: string[]; bgColor?: string } }) {
  // data.mbti, data.members が受け取れる前提
  const members = Array.isArray(data.members) ? data.members : [];

  return (
    <div
      style={{
        background: data.bgColor || "rgba(255, 255, 255, 0.2)", // 半透明の背景
        backdropFilter: "blur(10px)", // すりガラス効果
        WebkitBackdropFilter: "blur(10px)", // Safari 対応
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.3)", // 半透明の枠線
        padding: "12px",
        textAlign: "center",
        color: "#333",
        fontWeight: "bold",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // 軽い影をつける
        width: "140px",
      }}
    >
      {/* MBTIタイプ名 */}
      <div style={{ fontSize: "1rem", fontWeight: "bold", color: "#333", marginBottom: 6 }}>{data.mbti}</div>

      {/* メンバー名リスト */}
      {members.length > 0 ? (
        members.map((name: string, idx: number) => (
          <div key={idx} style={{ fontSize: "0.8rem", color: "#555" }}>
            {name}
          </div>
        ))
      ) : (
        <div style={{ fontSize: "0.8rem", color: "#999" }}>メンバーなし</div>
      )}

      <Handle type="source" position={Position.Right} id="source-right" />
      <Handle type="target" position={Position.Right} id="target-right" />
      <Handle type="source" position={Position.Left} id="source-left" />
      <Handle type="target" position={Position.Left} id="target-left" />
      <Handle type="source" position={Position.Top} id="source-Top" />
      <Handle type="target" position={Position.Top} id="target-Top" />
      <Handle type="source" position={Position.Bottom} id="source-Bottom" />
      <Handle type="target" position={Position.Bottom} id="target-Bottom" />
    </div>
  );
}
