"use client";
import { Handle, NodeProps, Position } from "reactflow";

/**
 * MBTIノードのカスタムコンポーネント
 * - ノードに MBTI タイプ + メンバー一覧を表示
 * - 上下左右のハンドルを配置して、任意の方向からエッジを接続可能
 */
export default function MbtiNode({ data }: NodeProps) {
  // data.mbti, data.members が受け取れる前提
  const members = Array.isArray(data.members) ? data.members : [];

  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "2px solid #666",
        borderRadius: 8,
        padding: 12,
        width: 140,
        textAlign: "center",
        position: "relative",
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
