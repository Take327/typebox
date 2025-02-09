"use client";

import GroupRelationFlow from "@/app/components/ReactFlow/GroupRelationFlow";
import { useProcessing } from "@/context/ProcessingContext"; // ローディング管理
import { Group, GroupMember, MBTIType } from "@/types";
import { compatibilityLabels, mbtiRelations } from "@/utils/mbti/Compatibility";
import { Card } from "flowbite-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * 入力データからReact Flow用のノードとエッジを生成する
 */
function generateGraphData(members: GroupMember[]) {
  // ノード生成 (id を number に統一)
  const nodes = members.map((member) => ({
    id: member.user_id, // number 型に統一
    user_name: member.user_name,
    mbti_type: member.mbti_type ?? "ISTJ", // NULL ガード (ISTJをデフォルトとする)
  }));

  // エッジ生成
  const edges = [];
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const source = members[i];
      const target = members[j];

      // MBTI相性スコア取得 (NULL の場合 "ISTJ" をデフォルト)
      const sourceType: MBTIType = (source.mbti_type ?? "ISTJ") as MBTIType;
      const targetType: MBTIType = (target.mbti_type ?? "ISTJ") as MBTIType;
      const score: number = mbtiRelations[sourceType]?.[targetType] ?? 1;
      const label: string = compatibilityLabels[score] ?? "Bad";

      edges.push({
        id: `e${source.user_id}-${target.user_id}`,
        source: source.user_id.toString(),
        target: target.user_id.toString(),
        label: label,
      });
    }
  }

  return { nodes, edges };
}

export default function GroupDetailPage(): JSX.Element {
  const { data: session, status } = useSession();
  const params = useParams() as { id: string };
  const router = useRouter();
  const { setProcessing } = useProcessing(); // ローディング制御
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
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

  // メンバー情報をGraphデータに変換
  const { nodes, edges } = generateGraphData(members);

  return (
    <div
      className="
        container mx-auto px-4 py-6
        grid grid-cols-1 gap-6
        sm:grid-cols-1
        md:grid-cols-2
        lg:grid-cols-2
      "
    >
      {/* Left Column (Group Info) */}
      <Card className="w-full shadow-lg p-6">
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
      </Card>

      {/* Right Column (相関図) */}
      <Card className="h-fit w-full shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">相関図（React Flow）</h2>
        <div className="flex flex-col justify-start">
          <GroupRelationFlow members={members} />
        </div>
      </Card>
    </div>
  );
}
