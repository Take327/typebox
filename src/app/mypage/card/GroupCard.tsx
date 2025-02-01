"use client";

import React, { useEffect, useState } from "react";

interface Group {
  id: number;
  name: string;
  description: string;
}

/**
 * グループ一覧を表示するコンポーネント
 * @returns {React.JSX.Element}
 */
export default function GroupCard(): React.JSX.Element {
  const [groups, setGroups] = useState<Group[]>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * グループ一覧を取得する関数
   * @async
   * @returns {Promise<void>}
   */
  async function fetchGroups(): Promise<void> {
    try {
      const res = await fetch("/api/groups", {
        method: "GET",
      });
      if (!res.ok) {
        throw new Error("グループ情報の取得に失敗しました");
      }
      const data: Group[] = await res.json();
      setGroups(data);
    } catch (err: any) {
      setError(err.message ?? "不明なエラーが発生しました");
    }
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">所属グループ</h2>
      {groups.length === 0 && <p>現在所属しているグループはありません</p>}
      <ul className="space-y-2">
        {groups.map((group) => (
          <li
            key={group.id}
            className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => {
              // グループ詳細ページへ遷移する処理
              // 例: useRouter() で router.push(`/groups/${group.id}`)
            }}
          >
            <h3 className="font-semibold">{group.name}</h3>
            <p className="text-sm text-gray-600">{group.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
