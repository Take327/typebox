"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useProcessing } from "../../context/ProcessingContext";

/** カスタムコンポーネント群 */
import DiagnosisCard from "./card/DiagnosisCard";
import GroupCard from "./card/GroupCard";
import NoDiagnosisCard from "./card/NoDiagnosisCard";
import DiagnosisListCard from "./card/DiagnosisListCard";

/** 型定義やユーティリティ */
import {
  DiagnosisData,
  MBTIDiagnosisResultFromServer,
  MBTIDiagnosisResult,
  isMBTIType,
  GroupData,
  MBTIScore,
} from "@/types";
import { formatDiagnosisData } from "@/utils/formatDiagnosisData";

/**
 * マイページコンポーネント
 *
 * - ユーザーの MBTI 診断結果を表示
 * - 診断履歴を表示
 * - 所属グループ一覧を表示
 * - ユーザー情報（自動承認フラグなど）の取得
 *
 * @returns {React.JSX.Element} マイページの JSX 要素
 */
export default function MyPage(): React.JSX.Element {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();
  const { setProcessing } = useProcessing();

  /** 最新の診断結果 */
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData | null>(null);
  /** 診断履歴一覧 */
  const [diagnosisHistory, setDiagnosisHistory] = useState<Array<{ date: string } & MBTIScore>>([]);
  /** ユーザー情報 */
  const [userData, setUserData] = useState<any | null>(null);
  /** ユーザーが所属するグループ一覧 */
  const [groups, setGroups] = useState<GroupData[]>([]);
  /** ローディング状態・エラー状態 */
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 最新の診断結果を取得する
   */
  const fetchDiagnosisResult = async (): Promise<void> => {
    setProcessing(true);
    try {
      const response = await fetch("/api/diagnosisResult", { method: "GET" });
      if (!response.ok) {
        throw new Error(`診断結果APIエラー: ${response.status} ${response.statusText}`);
      }

      const result: MBTIDiagnosisResultFromServer = await response.json();
      if (!result) throw new Error("診断結果が見つかりません");

      if (result.initialLogin) {
        // 初回ログインの場合は診断結果がまだ無い状態 => return
        console.warn("初回ログインのため診断結果なし。");
        return;
      }

      if (!isMBTIType(result.type)) {
        throw new Error("未知のMBTIタイプが返却されました: " + result.type);
      }

      const typedResult: MBTIDiagnosisResult = {
        type: result.type,
        ratio: result.ratio,
        bias: result.bias,
      };
      setDiagnosisData(formatDiagnosisData(typedResult));
    } catch (err: any) {
      console.error("診断データの取得に失敗:", err);
      setError(err.message || "診断データを取得できませんでした。");
    } finally {
      setProcessing(false);
    }
  };

  /**
   * 診断履歴一覧を取得する
   */
  const fetchDiagnosisHistory = async (): Promise<void> => {
    try {
      if (!userData?.id) return;

      const response = await fetch(`/api/diagnosisListResult?user_id=${userData.id}`, { method: "GET" });
      if (!response.ok) {
        throw new Error("診断履歴の取得に失敗しました。");
      }

      const historyData: Array<{ date: string } & MBTIScore>[] = await response.json();

      // 二重配列（[][]）の可能性がある場合、.flat() を使用して1次元配列に変換
      setDiagnosisHistory(historyData.flat());
    } catch (err) {
      console.error("診断履歴取得エラー:", err);
    }
  };

  /**
   * ユーザー情報を取得する
   */
  const fetchUserData = async (): Promise<void> => {
    try {
      if (!session?.user?.email) {
        router.push("/login");
        return;
      }
      const res = await fetch(`/api/users?email=${session.user.email}`, { method: "GET" });
      if (!res.ok) {
        throw new Error("ユーザー情報の取得に失敗しました。");
      }
      const data = await res.json();
      if (!data) {
        router.push("/login");
        return;
      }
      setUserData(data);
    } catch (err) {
      console.error("ユーザー情報の取得エラー:", err);
    }
  };

  /**
   * ユーザーが所属するグループ一覧を取得
   *
   * @async
   * @returns {Promise<void>}
   */
  const fetchGroups = async (): Promise<void> => {
    try {
      if (!userData?.id) return;

      const res = await fetch(`/api/groups?userId=${userData.id}`, { method: "GET" });
      if (!res.ok) {
        throw new Error("グループ一覧の取得に失敗しました。");
      }
      const groupsData = await res.json();
      setGroups(groupsData || []);
    } catch (err) {
      console.error("グループ一覧取得エラー:", err);
    }
  };

  /**
   * コンポーネントの初回マウント時にデータを取得
   *
   * - セッションが "authenticated" の時のみ動作
   */
  useEffect(() => {
    if (status !== "authenticated") return;

    let isMounted = true;
    setIsLoading(true);

    const initialize = async () => {
      try {
        await fetchDiagnosisResult();
        await fetchUserData();
      } catch (err) {
        console.error("初期化中にエラー:", err);
        setError("初期データ取得でエラーが発生しました。");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    initialize();

    return () => {
      isMounted = false;
    };
  }, [status]);

  /**
   * ユーザー情報が取得できたら診断履歴とグループ情報を取得
   */
  useEffect(() => {
    if (userData?.id) {
      fetchDiagnosisHistory();
      fetchGroups();
    }
  }, [userData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600 font-semibold">エラー: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* 診断データ */}
      {diagnosisData ? <DiagnosisCard diagnosisData={diagnosisData} /> : <NoDiagnosisCard />}
      {/* 診断履歴一覧 */}
      <DiagnosisListCard rawData={diagnosisHistory} />
      {/* 所属グループ */}
      <GroupCard groups={groups} />
    </div>
  );
}
