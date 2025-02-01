"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useGroups } from "../GroupsMockProvider";

/**
 * グループ新規作成ページ
 * @returns {JSX.Element} フォームUI
 */
export default function NewGroupPage(): JSX.Element {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { createGroup } = useGroups();
  const router = useRouter();

  /**
   * フォーム送信処理
   * @param {React.FormEvent} e - フォームイベント
   */
  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    if (!name) return;
    createGroup(name, description);
    router.push("/groups");
  }

  return (
    <div className="bg-white p-4 rounded shadow max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-4">グループを新規作成</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">グループ名</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例: 開発チーム"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">説明</label>
          <textarea
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="グループの目的や活動内容を入力"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            onClick={() => router.back()}
          >
            キャンセル
          </button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            作成
          </button>
        </div>
      </form>
    </div>
  );
}
