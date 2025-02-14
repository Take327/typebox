/**
 * @file page.tsx (groups/new)
 * @description グループを新規作成するフォーム
 */
"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

/**
 * グループ新規作成ページ
 * @returns JSX.Element
 */
export default function GroupNewPage(): JSX.Element {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  /**
   * フォーム送信時の処理
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      if (!res.ok) throw new Error("作成に失敗しました");
      // 作成したグループ情報のレスポンスを取得
      const newGroup = await res.json();
      router.push(`/groups/${newGroup.id}`);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">グループ新規作成</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">グループ名</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="例: 開発チーム"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">説明</label>
          <textarea
            className="w-full border rounded p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="例: フロントエンド・バックエンド総合開発チーム"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="mr-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            onClick={() => router.back()}
          >
            キャンセル
          </button>
          <button type="submit" className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded">
            作成
          </button>
        </div>
      </form>
    </div>
  );
}
