"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card } from "flowbite-react";
import { Group, GroupMember } from "@/types";
import { useProcessing } from "@/context/ProcessingContext"; // ローディング管理

export default function GroupDetailPage(): JSX.Element {
  const { data: session, status } = useSession();
  const params = useParams() as { id: string };
  const router = useRouter();
  const { setProcessing } = useProcessing(); // ローディング制御
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/api/auth/signin");
      return;
    }
  }, [status, session]);

  useEffect(() => {
    if (status !== "authenticated" || !params.id) return;
    let isMounted = true;

    async function fetchData() {
      try {
        await fetchGroupDetail();
        await fetchGroupMembers();
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();

    return () => {
      isMounted = false; // クリーンアップ
    };
  }, [status, params.id]);

  /**
   * グループ詳細を取得
   */
  async function fetchGroupDetail() {
    if (!session?.user?.id) return;
    setProcessing(true);
    try {
      const res = await fetch(`/api/groups/${params.id}`, {
        headers: {
          "x-user-id": session.user.id.toString(),
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error("グループ情報の取得に失敗しました");
      const data = await res.json();
      setGroup(data);
      setEditName(data.name);
      setEditDescription(data.description || "");
    } catch (error) {
      console.error(error);
      setError("グループ情報を取得できませんでした。");
    } finally {
      setProcessing(false);
    }
  }

  /**
   * 所属メンバー一覧を取得
   */
  async function fetchGroupMembers() {
    if (!session?.user?.id) return;
    setProcessing(true);
    try {
      const res = await fetch(`/api/groups/${params.id}/members`, {
        headers: {
          "x-user-id": session.user.id.toString(),
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error("メンバー情報の取得に失敗しました");
      const data = await res.json();
      setMembers(data);
    } catch (error) {
      console.error(error);
      setError("メンバー情報を取得できませんでした。");
    } finally {
      setProcessing(false);
    }
  }

  /**
   * グループ情報を保存
   */
  async function handleSave() {
    if (!group || !session?.user?.id) return;
    setProcessing(true);
    try {
      const res = await fetch(`/api/groups/${group.id}`, {
        method: "PUT",
        headers: {
          "x-user-id": session.user.id.toString(),
          "Content-Type": "application/json",
        },
        credentials: "include",
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
    if (!group || !session?.user?.id) return;
    setProcessing(true);
    try {
      const res = await fetch(`/api/groups/${group.id}`, {
        method: "DELETE",
        headers: {
          "x-user-id": session.user.id.toString(),
        },
        credentials: "include",
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
        <h2 className="text-xl font-semibold mb-4">{group?.name}</h2>
        <p className="text-gray-500 text-sm mb-4">
          ID: {group?.id} / 作成日: {group?.created_at}
        </p>
        <p className="text-gray-700">{group?.description}</p>

        {/* 所属メンバー一覧 */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">メンバー一覧</h3>
          {members.length === 0 ? (
            <p className="text-gray-500">メンバーがいません。</p>
          ) : (
            <ul className="space-y-2">
              {members.map((member) => (
                <li key={member.id} className="p-3 border rounded-lg bg-gray-100">
                  <p className="font-semibold">{member.user_name}</p>
                  <p className="text-sm text-gray-600">MBTI: {member.mbti_type || "不明"}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

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
      </Card>
    </div>
  );
}
