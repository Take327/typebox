/**
 * @file page.tsx (groups/[id])
 * @description グループ詳細、編集、削除など
 */
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Group } from "@/types";

export default function GroupDetailPage(): JSX.Element {
  const params = useParams() as { id: string };
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    fetchGroupDetail();
  }, [params.id]);

  /**
   * グループ詳細を取得する
   */
  async function fetchGroupDetail() {
    try {
      const res = await fetch(`/api/groups/${params.id}`);
      if (!res.ok) throw new Error("取得失敗");
      const data = await res.json();
      setGroup(data);
      setEditName(data.name);
      setEditDescription(data.description || "");
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * グループ情報を保存
   */
  async function handleSave() {
    if (!group) return;
    try {
      const res = await fetch(`/api/groups/${group.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          description: editDescription,
        }),
      });
      if (!res.ok) throw new Error("更新失敗");
      await fetchGroupDetail();
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * グループを削除
   */
  async function handleDelete() {
    if (!group) return;
    try {
      const res = await fetch(`/api/groups/${group.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("削除失敗");
      router.push("/groups");
    } catch (error) {
      console.error(error);
    }
  }

  if (!group) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <p>グループが見つかりませんでした。</p>
        <button
          onClick={() => router.push("/groups")}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          一覧へ戻る
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow max-w-md mx-auto">
      {isEditing ? (
        <>
          <h2 className="text-xl font-bold mb-2">グループ編集</h2>
          <div className="mb-4">
            <label className="block font-semibold mb-1">グループ名</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">説明</label>
            <textarea
              className="w-full border rounded p-2"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button onClick={() => setIsEditing(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
              キャンセル
            </button>
            <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              保存
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-2">グループ詳細</h2>
          <p className="text-sm text-gray-600 mb-4">
            ID: {group.id} / 作成日: {group.created_at}
          </p>
          <p className="text-lg font-semibold">{group.name}</p>
          <p className="mt-2">{group.description}</p>
          <div className="flex justify-end space-x-2 mt-4">
            <button onClick={() => router.back()} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
              戻る
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              編集
            </button>
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              削除
            </button>
          </div>
        </>
      )}
    </div>
  );
}
