"use client";
import React from "react";
import { Handle, Position, NodeProps } from "reactflow";

/**
 * @description MBTIノードのカスタムコンポーネント
 * 上下左右にエッジを接続できるようにカスタマイズ
 */
export default function MbtiNode({ data }: NodeProps) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 12,
        width: 120,
        textAlign: "center",
        position: "relative",
      }}
    >
      {/* メンバー名リスト */}
      {data.members.map((name: string, index: number) => (
        <div key={index} style={{ fontWeight: "bold" }}>
          {name}
        </div>
      ))}
      {/* MBTIタイプ */}
      <div style={{ fontSize: "0.8rem", color: "#666" }}>{data.mbti}</div>

      {/* 上下左右にエッジの接続ポイントを配置 */}
      <Handle type="source" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Left} id="left" />

      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="target" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Bottom} id="bottom" />
      <Handle type="target" position={Position.Left} id="left" />
    </div>
  );
}
