/**
 * @file page.tsx (groups/[id]/members)
 * @description グループメンバー一覧・招待フォーム
 */
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { GroupMember } from "@/types";

/**
 * グループメンバー管理画面
 * @returns JSX.Element
 */
export default function GroupMembersPage(): JSX.Element {
  const params = useParams() as { id: string };
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [inviteUserId, setInviteUserId] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  /**
   * メンバー一覧を取得
   */
  async function fetchMembers() {
    try {
      const res = await fetch(`/api/groups/${params.id}/members`);
      if (!res.ok) throw new Error("メンバー取得に失敗しました");
      const data = await res.json();
      setMembers(data);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * メンバー招待 (userIdを指定)
   */
  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/groups/${params.id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: Number(inviteUserId) }),
      });
      if (!res.ok) throw new Error("招待に失敗しました");
      // auto_approval が ON のユーザーなら即時メンバー追加されるので再取得
      await fetchMembers();
      setInviteUserId("");
      alert("招待リクエストを送信しました");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">メンバー管理</h2>

      {/* メンバー一覧 */}
      <ul className="mb-6 space-y-2">
        {members.map((m) => (
          <li key={m.user_id} className="border rounded p-2">
            ユーザーID: {m.user_id}, 参加日時: {m.joined_at}
          </li>
        ))}
      </ul>

      {/* 招待フォーム */}
      <form onSubmit={handleInvite} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">ユーザーIDを入力</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={inviteUserId}
            onChange={(e) => setInviteUserId(e.target.value)}
            placeholder="例: 123"
          />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            招待
          </button>
        </div>
      </form>
    </div>
  );
}
