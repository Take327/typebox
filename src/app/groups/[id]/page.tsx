"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useGroups } from "../GroupsMockProvider";
import { Group } from "../GroupsMockProvider";

/**
 * グループ詳細・編集ページ
 * @returns {JSX.Element} グループ詳細/編集UI
 */
export default function GroupDetailPage(): JSX.Element {
  const router = useRouter();
  const params = useParams() as { id: string };
  const { groups, updateGroup, deleteGroup } = useGroups();

  const [group, setGroup] = useState<Group | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // 編集用State
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // グループ取得
  useEffect(() => {
    const found = groups.find((g) => g.id === params.id) ?? null;
    setGroup(found);

    if (found) {
      setEditName(found.name);
      setEditDescription(found.description);
    }
  }, [groups, params.id]);

  // 「group が null なら早期リターンする」ことで、以下の処理では group が必ず存在
  if (!group) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <p>該当のグループが見つかりません</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
          onClick={() => router.push("/groups")}
        >
          一覧へ戻る
        </button>
      </div>
    );
  }

  /**
   * 編集内容を保存する
   * @returns {void}
   */
  function handleSave(): void {
    if (group) {
      updateGroup(group.id, { name: editName, description: editDescription });
      setIsEditing(false);
    }
  }

  /**
   * グループを削除する
   * @returns {void}
   */
  function handleDelete(): void {
    if (group) {
      deleteGroup(group.id);
      router.push("/groups");
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow max-w-md mx-auto">
      {!isEditing ? (
        <>
          <h2 className="text-lg font-bold mb-2">グループ詳細</h2>
          <p className="text-gray-600">ID: {group.id}</p>
          <p className="text-xl font-semibold mt-2">{group.name}</p>
          <p className="mt-2">{group.description}</p>

          <div className="flex justify-end space-x-2 mt-4">
            <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400" onClick={() => router.back()}>
              戻る
            </button>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              onClick={() => setIsEditing(true)}
            >
              編集
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={handleDelete}>
              削除
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-lg font-bold mb-2">グループ編集</h2>
          <div className="mb-4">
            <label className="block font-semibold mb-1">グループ名</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">説明</label>
            <textarea
              className="w-full border p-2 rounded"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400" onClick={() => setIsEditing(false)}>
              キャンセル
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={handleSave}>
              保存
            </button>
          </div>
        </>
      )}
    </div>
  );
}
