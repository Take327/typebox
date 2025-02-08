"use client";
import React from "react";
import { Handle, Position, NodeProps } from "reactflow";

/**
 * @description MBTIノード。ノード内にメンバー名とMBTIタイプを表示。
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
        boxShadow: "2px 2px 5px rgba(0,0,0,0.1)", // 影をつけて視認性向上
      }}
    >
      {/* メンバー名 */}
      <div style={{ fontWeight: "bold", marginBottom: 4 }}>{data.label}</div>
      {/* MBTIタイプ */}
      <div style={{ fontSize: "0.8rem", color: "#666" }}>{data.mbti}</div>

      {/* 入力・出力用のハンドル（必要に応じて） */}
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
}
