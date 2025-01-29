"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useProcessing } from "../../context/ProcessingContext";
import DiagnosisCard from "./card/DiagnosisCard";
import GroupCard from "./card/GroupCard";
import SettingsCard from "./card/SettingsCard";
import { DiagnosisData, EISNTFJP_VALUES, MBTIScore } from "@/types";
import { useRouter } from "next/router";
import { formatDiagnosisData } from "@/utils/formatDiagnosisData";
import FlowbitAlertError from "../components/Flowbit/FlowbitAlertError";
import { convertScoreToDiagnosisResult } from "@/utils/mbti/mbtiUtils";

/**
 * マイページを表示するコンポーネント。
 *
 * 子コンポーネントとして
 * - 診断結果: <DiagnosisCard />
 * - 所属グループ: <GroupCard />
 * - 各種設定: <SettingsCard />
 * を呼び出します。
 */

export default function MyPage(): React.JSX.Element {
  const { setProcessing } = useProcessing();
  const { data: session } = useSession();
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [router, setRouter] = useState<ReturnType<typeof useRouter> | null>(null);
  const [autoApproval, setAutoApproval] = useState(false);

  /**
   * 診断結果を取得する非同期関数
   */
  const isValidScore = (score: unknown): score is MBTIScore => {
    if (typeof score !== "object" || score === null) {
      return false;
    }

    return EISNTFJP_VALUES.every((key) => typeof (score as Record<string, unknown>)[key] === "number");
  };

  const fetchDiagnosisResult = async () => {
    try {
      const response = await fetch("/api/diagnosisResult", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`エラーが発生しました: ${response.statusText}`);
      }

      const result = (await response.json()) as MBTIScore;

      if (!result) {
        throw new Error("診断結果が無効です: 診断情報がありません");
      }

      if (!isValidScore(result)) {
        throw new Error("診断結果が無効です: スコアデータが不完全です");
      }

      const transformedData = formatDiagnosisData(convertScoreToDiagnosisResult(result));
      setDiagnosisData(transformedData);
    } catch (err) {
      console.error("データの取得中にエラー:", err);
      setError("診断結果を取得できませんでした。");
    }
  };

  /**
   * 初期データ（自動承認フラグなど）を取得する非同期関数
   */
  const fetchInitialSettings = async () => {
    try {
      setProcessing(true);
      if (!router) {
        return;
      }

      if (!session) {
        router.push("/login"); // クライアント側のみリダイレクト
        return;
      }

      const userResponse = await fetch(`/api/users?email=${session.user?.email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!userResponse.ok) {
        throw new Error("ユーザー情報の取得に失敗しました。");
      }

      const userData = await userResponse.json();
      // 認証エラーならログイン画面へリダイレクト
      if (!userData) {
        router.push("/login"); // クライアント側のみリダイレクト
        return;
      }

      setAutoApproval(userData.autoApproval);
    } catch (err) {
      console.error("データの取得中にエラー:", err);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    fetchDiagnosisResult();
    fetchInitialSettings();
  }, [router]); // router が初期化された後に fetchDiagnosisResult を実行

  return (
    <>
      {error == null ? <></> : <FlowbitAlertError msg={error} />}
      <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {diagnosisData == null ? (
          <></>
        ) : (
          <>
            {/* 診断データ */}
            <DiagnosisCard diagnosisData={diagnosisData} />
            {/* 所属グループ */}
            <GroupCard />
            {/* 各種設定カード */}
            <SettingsCard
              session={session}
              setProcessing={setProcessing}
              autoApproval={autoApproval}
              setAutoApproval={setAutoApproval}
            />
          </>
        )}
      </div>
    </>
  );
}
