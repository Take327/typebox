"use client";
import React from "react";

/**
 * @typedef {Object} GroupData
 * @property {number} id - グループID
 * @property {string} name - グループ名
 * @property {string|null} description - グループの説明
 */

/**
 * @description グループ一覧表示用カード
 * @param {{ groups: GroupData[] }} props - グループ配列
 * @returns {JSX.Element}
 */
export default function GroupCard({
  groups,
}: {
  groups: { id: number; name: string; description: string | null }[];
}): React.JSX.Element {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">所属グループ</h2>
      {groups.length === 0 ? (
        <p className="text-gray-500">現在所属しているグループはありません</p>
      ) : (
        <ul className="space-y-2">
          {groups.map((g) => (
            <li key={g.id} className="border-b pb-2 mb-2 last:mb-0 last:border-b-0">
              <div className="font-semibold">{g.name}</div>
              {g.description && <div className="text-sm text-gray-600">{g.description}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
