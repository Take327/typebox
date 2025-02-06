"use client";
import Card from "@/app/components/Card";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  return (
    <Card title="所属グループ">
      <div className="flex w-full h-full flex-col justify-between">
        <div>
          {groups.length === 0 ? (
            <p className="text-gray-500">現在所属しているグループはありません</p>
          ) : (
            <ul className="space-y-2">
              {groups.slice(0, 4).map((group) => (
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
          <a href="/groups" className="inline-block mt-2 text-sm text-blue-500">
            すべて表示
          </a>
        </div>
        <Link href="/groups/new">
          <button className="bg-accent hover:bg-accent-dark px-4 py-2 mt-4 text-white rounded ">
            新規グループ作成
          </button>
        </Link>
      </div>
    </Card>
  );
}
