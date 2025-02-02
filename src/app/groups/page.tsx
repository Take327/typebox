/**
 * @file page.tsx
 * @description グループ一覧を取得・表示
 */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Group } from "@/types";

export default function GroupListPage(): JSX.Element {
  const [groups, setGroups] = useState<Group[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  /**
   * グループ一覧を取得
   * @async
   */
  async function fetchGroups() {
    try {
      const res = await fetch("/api/groups");
      if (!res.ok) {
        throw new Error("グループ取得に失敗しました");
      }
      const data = await res.json();
      setGroups(data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">グループ一覧</h2>
        <button
          onClick={() => router.push("/groups/new")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          新規作成
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-2">
        {groups.map((group) => (
          <li
            key={group.id}
            className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => router.push(`/groups/${group.id}`)}
          >
            <h3 className="font-bold">{group.name}</h3>
            <p className="text-sm text-gray-600">{group.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
