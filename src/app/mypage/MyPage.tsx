"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useProcessing } from "../../context/ProcessingContext";
import DiagnosisCard from "./card/DiagnosisCard";
import GroupCard from "./card/GroupCard";
import SettingsCard from "./card/SettingsCard";
import {
  DiagnosisData,
  EISNTFJP_VALUES,
  isMBTIType,
  MBTIBias,
  MBTIDiagnosisResult,
  MBTIDiagnosisResultFromServer,
  MBTIScore,
} from "@/types";
import { useRouter } from "next/navigation";
import { formatDiagnosisData } from "@/utils/formatDiagnosisData";
import NoDiagnosisCard from "./card/NoDiagnosisCard";

export default function MyPage(): React.JSX.Element {
  const { setProcessing } = useProcessing();
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 診断結果を取得する非同期関数
   * - `/api/diagnosisResult` へ GET リクエストを送信
   * - 診断データがない場合は初回ログインと判断
   * - スコアデータが不正な場合はエラーをスロー
   */
  const fetchDiagnosisResult = async () => {
    setProcessing(true);
    try {
      // 1) APIから JSON を取得
      const response = await fetch("/api/diagnosisResult", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`エラー: ${response.status} ${response.statusText}`);
      }

      // JSON データを取得
      const result: MBTIDiagnosisResultFromServer = await response.json();

      // 診断結果が null や undefined の場合はエラー
      if (!result) throw new Error("診断結果が見つかりません");

      // 2) 初回ログイン時
      if (result.initialLogin) {
        console.warn("初回ログインのため診断結果なし。");
        return;
      }

      // 3) サーバーが返す 'type' は string。 -> isMBTIType でチェック
      if (!isMBTIType(result.type)) {
        // 16種類に該当しない文字列ならエラー扱い
        throw new Error("未知の MBTIタイプが返却されました: " + result.type);
      }

      // 4) ここで安全に 'type' を MBTIType に変換
      const typedResult: MBTIDiagnosisResult = {
        type: result.type, // ここでは result.type は MBTIType と確定
        ratio: result.ratio, // そのままコピー
        bias: result.bias, // そのままコピー
      };

      // 5) さらに UI 表示用に整形
      const diagData = formatDiagnosisData(typedResult);
      setDiagnosisData(diagData);
    } catch (err) {
      console.error("診断データの取得に失敗:", err);
      setError("診断データを取得できませんでした。");
    } finally {
      setProcessing(false);
    }
  };

  /**
   * ユーザーの初期設定（自動承認フラグなど）を取得する非同期関数
   * - `/api/users` へ GET リクエストを送信し、メールアドレスをキーにユーザー情報を取得
   * - セッションがない場合はログインページにリダイレクト
   * - ユーザー情報の取得に失敗した場合はエラーをスロー
   */
  const fetchInitialSettings = async () => {
    try {
      // セッションがない場合はログイン画面にリダイレクト
      if (!session) {
        router.push("/login");
        return;
      }

      const userResponse = await fetch(`/api/users?email=${session.user?.email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!userResponse.ok) {
        throw new Error("ユーザー情報の取得に失敗しました。");
      }

      // JSON データを取得
      const userData = await userResponse.json();

      // ユーザー情報が取得できなかった場合はログインページにリダイレクト
      if (!userData) {
        router.push("/login");
        return;
      }

      console.log("デバッグ", userData.autoApproval);
      // 自動承認フラグを状態にセット
      //setAutoApproval(userData.autoApproval);
    } catch (err) {
      console.error("初期設定の取得エラー:", err);
    }
  };

  /**
   * コンポーネントのマウント時に診断データと初期設定を取得する
   * - 認証状態 (`status`) が `"authenticated"` の場合のみ実行
   * - コンポーネントがアンマウントされた場合に `isMounted` を利用して処理をキャンセル
   */
  useEffect(() => {
    if (status !== "authenticated") return;

    let isMounted = true;
    setIsLoading(true);

    const fetchData = async () => {
      try {
        await fetchDiagnosisResult();
        await fetchInitialSettings();
      } catch (error) {
        console.error("データ取得中にエラー:", error);
        setError("データの取得に失敗しました。");
      } finally {
        if (isMounted) setIsLoading(false); // データ取得完了後にローディング終了
      }
    };

    fetchData();
    return () => {
      isMounted = false; // コンポーネントがアンマウントされた場合にフラグをリセット
    };
  }, [status]); // 認証状態が変わった場合に再実行

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

  // 診断結果がnullならNoDiagnosisCard表示
  if (!diagnosisData) {
    return <NoDiagnosisCard />;
  }

  // 診断結果があれば表示
  return (
    <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* 診断データ */}
      <DiagnosisCard diagnosisData={diagnosisData} />
      {/* 所属グループ */}
      <GroupCard />
      {/* 各種設定カード */}
      <SettingsCard session={session} setProcessing={setProcessing} />
    </div>
  );
}
