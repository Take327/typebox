"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useProcessing } from "../../context/ProcessingContext";

/** カスタムコンポーネント群 */
import DiagnosisCard from "./card/DiagnosisCard";
import GroupCard from "./card/GroupCard";
import NoDiagnosisCard from "./card/NoDiagnosisCard";

/** 型定義やユーティリティ */
import { DiagnosisData, MBTIDiagnosisResultFromServer, MBTIDiagnosisResult, isMBTIType, GroupData } from "@/types";
import { formatDiagnosisData } from "@/utils/formatDiagnosisData";

/**
 * @typedef {Object} UserData
 * @property {number} id - ユーザーID
 * @property {string} name - ユーザー名
 * @property {string} email - メールアドレス
 * @property {boolean} autoApproval - 自動承認フラグ
 */

/**
 * @typedef {Object} GroupData
 * @property {number} id - グループID
 * @property {string} name - グループ名
 * @property {string|null} description - グループの説明
 */

/**
 * @description マイページコンポーネント
 * - 診断結果
 * - グループ一覧
 * - 設定カード（自動承認フラグなど）
 */
export default function MyPage(): React.JSX.Element {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();
  const { setProcessing } = useProcessing();

  /** 診断結果 */
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData | null>(null);
  /** ユーザー情報 (自動承認フラグなど) */
  const [userData, setUserData] = useState<any | null>(null);
  /** ユーザーが所属するグループ一覧 */
  const [groups, setGroups] = useState<GroupData[]>([]);
  /** ローディング状態/エラー状態 */
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 診断結果を取得する非同期関数
   * @async
   * @returns {Promise<void>}
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
   * ユーザー情報（自動承認フラグなど）を取得する非同期関数
   * @async
   * @returns {Promise<void>}
   */
  const fetchUserData = async (): Promise<void> => {
    try {
      if (!session?.user?.email) {
        router.push("/login");
        return;
      }
      const res = await fetch(`/api/users?email=${session.user.email}`, {
        method: "GET",
      });
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
   * ユーザーが所属するグループ一覧を取得する
   * @async
   * @returns {Promise<void>}
   */
  const fetchGroups = async (): Promise<void> => {
    try {
      if (!userData?.id) return;

      const res = await fetch(`/api/groups?userId=${userData.id}`, {
        method: "GET",
      });
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
   * コンポーネント初回マウント時のデータ取得
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
   * ユーザー情報が取得できたら、そのユーザーが所属するグループ一覧も取得する
   */
  useEffect(() => {
    if (userData?.id) {
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

  // 診断結果が null なら診断前カードを表示
  const hasDiagnosis = diagnosisData !== null;
  if (!hasDiagnosis) {
    return (
      <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
        <NoDiagnosisCard />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* 診断データ */}
      <DiagnosisCard diagnosisData={diagnosisData!} />
      {/* 所属グループ - 取得できたものを props で渡す */}
      <GroupCard groups={groups} />
    </div>
  );
}
