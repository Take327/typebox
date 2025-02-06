"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "flowbite-react";
import { Group } from "@/types";
import { useProcessing } from "@/context/ProcessingContext"; // ローディング管理

export default function GroupDetailPage(): JSX.Element {
  const params = useParams() as { id: string };
  const router = useRouter();
  const { setProcessing } = useProcessing(); // ローディング制御
  const [group, setGroup] = useState<Group | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGroupDetail();
  }, [params.id]);

  /**
   * グループ詳細を取得する
   */
  async function fetchGroupDetail() {
    setProcessing(true); // ローディング開始
    try {
      const res = await fetch(`/api/groups/${params.id}`);
      if (!res.ok) throw new Error("グループ情報の取得に失敗しました");
      const data = await res.json();
      setGroup(data);
      setEditName(data.name);
      setEditDescription(data.description || "");
    } catch (error) {
      console.error(error);
      setError("グループ情報を取得できませんでした。");
    } finally {
      setProcessing(false); // ローディング終了
    }
  }

  /**
   * グループ情報を保存
   */
  async function handleSave() {
    if (!group) return;
    setProcessing(true);
    try {
      const res = await fetch(`/api/groups/${group.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          description: editDescription,
        }),
      });
      if (!res.ok) throw new Error("更新に失敗しました");
      await fetchGroupDetail();
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setError("グループの更新に失敗しました。");
    } finally {
      setProcessing(false);
    }
  }

  /**
   * グループを削除
   */
  async function handleDelete() {
    if (!group) return;
    setProcessing(true);
    try {
      const res = await fetch(`/api/groups/${group.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("削除に失敗しました");
      router.push("/groups");
    } catch (error) {
      console.error(error);
      setError("グループの削除に失敗しました。");
    } finally {
      setProcessing(false);
    }
  }

  /** エラー時の表示 */
  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold text-red-500">エラー</h1>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => router.push("/groups")}
          className="mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
        >
          グループ一覧へ戻る
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-center text-2xl font-bold">グループ詳細</h1>

      <Card className="max-w-2xl mx-auto shadow-lg p-6">
        {isEditing ? (
          <>
            <h2 className="text-xl font-semibold mb-4">グループ編集</h2>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-1">グループ名</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-lg font-medium mb-1">説明</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
              >
                保存
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">{group?.name}</h2>
            <p className="text-gray-500 text-sm mb-4">
              ID: {group?.id} / 作成日: {group?.created_at}
            </p>
            <p className="text-gray-700">{group?.description}</p>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                戻る
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
              >
                編集
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                削除
              </button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
