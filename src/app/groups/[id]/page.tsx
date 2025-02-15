"use client";

import GroupRelationFlow from "@/app/components/ReactFlow/GroupRelationFlow";
import { useProcessing } from "@/context/ProcessingContext"; // ローディング管理
import { Group, GroupMember, MBTIType } from "@/types";
import { Card } from "flowbite-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid"; // UUID生成ライブラリ
import { MdContentCopy } from "react-icons/md";
import EdgeLegend from "@/app/components/EdgeLegend";
import { analyzeMBTI } from "@/utils/openai/analyzeMBTI";

const matrixLeft = [
  ["ENTP", "ISFP"],
  ["ESFJ", "INTJ"],
  ["INTP", "ESFP"],
  ["ISFJ", "ENTJ"],
];

const matrixRight = [
  ["ISTP", "ENFP"],
  ["INFJ", "ESTJ"],
  ["ESTP", "INFP"],
  ["ENFJ", "ISTJ"],
];

export default function GroupDetailPage(): JSX.Element {
  const { data: session, status } = useSession();
  const params = useParams() as { id: string };
  const router = useRouter();
  const { setProcessing } = useProcessing(); // ローディング制御
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);

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

  useEffect(() => {
    if (params.id) {
      // フロントでUUIDを生成し、招待URLを作成
      const generatedToken = uuidv4();
      const mockInviteUrl = `${window.location.origin}/invite/${generatedToken}`;
      setInviteUrl(mockInviteUrl);
    }
  }, [params.id]);

  /**
   * グループ詳細を取得
   */
  async function fetchGroupDetail() {
    if (!session?.user?.id) return;
    console.log("Fetching group detail for groupId:", params.id); // 追加
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

  const handleAnalyze = async () => {
    setAnalysis(null);

    try {
      setProcessing(true);
      const result = await analyzeMBTI(members);
      setAnalysis(result.analysis);
    } catch (error) {
      setAnalysis("診断に失敗しました");
    } finally {
      setProcessing(false);
    }
  };

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
    <div className="container mx-auto px-4 py-6 flex flex-col gap-6 md:flex-row md:justify-between">
      {/* Left Column (Group Info) */}
      <div className="w-full max-w-screen-md space-y-6">
        <Card className="h-fit w-full shadow-lg p-2 sm:p-6">
          <h2 className="text-xl font-semibold mb-4">グループ詳細</h2>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">招待URL</h3>
            {inviteUrl ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inviteUrl}
                  readOnly
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-700"
                />
                <button className="p-2 rounded-lg hover:bg-gray-200 transition">
                  <MdContentCopy size={24} className="text-gray-600" />
                </button>
              </div>
            ) : (
              <p className="text-gray-500">招待URLを生成中...</p>
            )}
          </div>
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
        <Card className="h-fit w-full shadow-lg p-2 sm:p-6">
          <h2 className="text-lg font-bold"> AI診断</h2>
          <button onClick={handleAnalyze} className="mt-4 px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded">
            診断を開始
          </button>
          {analysis && <p className="mt-4 text-gray-700 whitespace-pre-line">{analysis}</p>}
        </Card>
      </div>
      {/* Right Column (相関図) */}
      <Card className="h-fit w-full shadow-lg p-2 sm:p-6">
        <h2 className="text-xl font-semibold mb-2">相関図</h2>
        <EdgeLegend />
        <div className="flex flex-col justify-start">
          <GroupRelationFlow members={members} matrix={matrixLeft} />
          <GroupRelationFlow members={members} matrix={matrixRight} />
        </div>
      </Card>
    </div>
  );
}
