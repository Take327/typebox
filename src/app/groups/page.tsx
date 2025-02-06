"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useUserData } from "@/hooks/useUserData";
import { useGroups } from "@/hooks/useGroups";

/**
 * グループ一覧ページ
 */
export default function GroupListPage(): JSX.Element {
  const router = useRouter();
  const userData = useUserData();
  const { groups, isLoading, error } = useGroups(userData?.id || null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600 font-semibold">エラー: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">グループ一覧</h2>
        <button
          onClick={() => router.push("/groups/new")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          新規作成
        </button>
      </div>

      {groups.length === 0 ? (
        <p className="text-gray-500">所属グループがありません。</p>
      ) : (
        <ul className="space-y-4">
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
      )}
    </div>
  );
}
