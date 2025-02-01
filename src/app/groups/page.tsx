"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGroups } from "./GroupsMockProvider";

/**
 * グループ一覧ページ
 * @returns {JSX.Element} 一覧UI
 */
export default function GroupsPage(): JSX.Element {
  const router = useRouter();
  const { groups } = useGroups();

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">所属グループ一覧</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => router.push("/groups/new")}
        >
          新規作成
        </button>
      </div>
      {groups.length === 0 ? (
        <p>現在所属しているグループはありません</p>
      ) : (
        <ul className="space-y-2">
          {groups.map((group) => (
            <li
              key={group.id}
              className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
              onClick={() => router.push(`/groups/${group.id}`)}
            >
              <h3 className="font-semibold">{group.name}</h3>
              <p className="text-sm text-gray-600">{group.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
