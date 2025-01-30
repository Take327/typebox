"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useProcessing } from "../../context/ProcessingContext";
import DiagnosisCard from "./card/DiagnosisCard";
import GroupCard from "./card/GroupCard";
import SettingsCard from "./card/SettingsCard";
import { DiagnosisData, EISNTFJP_VALUES, MBTIScore } from "@/types";
import { useRouter } from "next/navigation";
import { formatDiagnosisData } from "@/utils/formatDiagnosisData";
import { convertScoreToDiagnosisResult } from "@/utils/mbti/mbtiUtils";
import NoDiagnosisCard from "./card/NoDiagnosisCard";

export default function MyPage(): React.JSX.Element {
  const { setProcessing } = useProcessing();
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 診断データのスコアが正しい型かを検証する関数
   * @param score - 診断データのスコア情報（型が不明なデータ）
   * @returns 正しい MBTI スコアの形式であれば true、それ以外は false
   */
  const isValidScore = (score: unknown): score is MBTIScore => {
    return (
      typeof score === "object" &&
      score !== null &&
      EISNTFJP_VALUES.every((key) => typeof (score as Record<string, unknown>)[key] === "number")
    );
  };

  /**
   * 診断結果を取得する非同期関数
   * - `/api/diagnosisResult` へ GET リクエストを送信
   * - 診断データがない場合は初回ログインと判断
   * - スコアデータが不正な場合はエラーをスロー
   */
  const fetchDiagnosisResult = async () => {
    setProcessing(true); // データ取得開始前に処理中状態にする
    try {
      const response = await fetch("/api/diagnosisResult", {
        method: "GET",
        credentials: "include", // 認証情報を含めたリクエストを送信
        headers: { "Content-Type": "application/json" },
      });

      // レスポンスのステータスコードが 200 以外ならエラーをスロー
      if (!response.ok) {
        throw new Error(`エラー: ${response.status} ${response.statusText}`);
      }

      // JSON データを取得
      const result = await response.json();

      // 診断結果が null や undefined の場合はエラー
      if (!result) throw new Error("診断結果が見つかりません");

      // 初回ログイン時は診断結果がないため、処理を終了
      if (result.initialLogin) {
        console.warn("初回ログインのため診断結果なし。");
        return;
      }

      // 診断スコアの形式が正しくない場合はエラー
      if (!isValidScore(result)) throw new Error("診断データのスコアが無効です");

      // データを適切な形式に変換して状態を更新
      setDiagnosisData(formatDiagnosisData(convertScoreToDiagnosisResult(result)));
    } catch (err) {
      console.error("診断データの取得に失敗:", err);
      setError("診断データを取得できませんでした。");
    } finally {
      setProcessing(false); // 処理終了後、処理中フラグを解除
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

      // レスポンスのステータスコードが 200 以外ならエラーをスロー
      if (!userResponse.ok) throw new Error("ユーザー情報の取得に失敗しました。");

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
    if (status !== "authenticated") return; // 認証されていない場合は何もしない

    let isMounted = true; // コンポーネントがマウントされているかのフラグ
    setIsLoading(true); // データ取得開始前にローディング状態を設定

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

  return (
    <>
      {isLoading ? ( // ✅ 非同期処理中はローディング表示
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      ) : diagnosisData == null ? ( // ✅ データがない場合は `NoDiagnosisCard`
        <NoDiagnosisCard />
      ) : (
        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* 診断データ */}
          <DiagnosisCard diagnosisData={diagnosisData} />
          {/* 所属グループ */}
          <GroupCard />
          {/* 各種設定カード */}
          <SettingsCard session={session} setProcessing={setProcessing} />
        </div>
      )}
    </>
  );
}
