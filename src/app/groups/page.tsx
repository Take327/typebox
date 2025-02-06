"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserData } from "@/hooks/useUserData";
import { useGroups } from "@/hooks/useGroups";
import { useProcessing } from "@/context/ProcessingContext";

/**
 * グループ一覧ページ
 */
export default function GroupListPage(): JSX.Element {
  const router = useRouter();
  const userData = useUserData();
  const { groups, error } = useGroups(userData?.id || null);
  const { setProcessing } = useProcessing(); // ローディング制御
  const [isDataFetched, setIsDataFetched] = useState(false);

  // ローディング状態を管理
  useEffect(() => {
    if (userData && groups) {
      setProcessing(false);
      setIsDataFetched(true);
    } else {
      setProcessing(true);
    }
  }, [userData, groups, setProcessing]);

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
          className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded"
        >
          新規作成
        </button>
      </div>

      {isDataFetched && groups.length === 0 ? (
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
