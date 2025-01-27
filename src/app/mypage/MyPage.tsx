"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useProcessing } from "../../context/ProcessingContext";
import DiagnosisCard from "./card/DiagnosisCard";
import GroupCard from "./card/GroupCard";
import SettingsCard from "./card/SettingsCard";
import { DiagnosisData } from "@/types";
import { useRouter } from "next/router";
import { formatDiagnosisData } from "@/utils/formatDiagnosisData";
import FlowbitAlertError from "../components/Flowbit/FlowbitAlertError";

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

  /**
   * 診断結果を取得する非同期関数
   */
  const fetchDiagnosisResult = async () => {
    try {
      // 診断結果の取得
      const response = await fetch("/api/diagnosisResult", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // 認証エラーならログイン画面へリダイレクト
      if (response.status === 401) {
        if (router) {
          router.push("/login"); // クライアント側のみリダイレクト
        }
        return;
      }

      if (!response.ok) {
        throw new Error(`エラーが発生しました: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.initialLogin) {
        setError("診断結果がありません。診断を開始してください。");
      } else {
        const transformedData = formatDiagnosisData(result);
        setDiagnosisData(transformedData);
      }
    } catch (err) {
      console.error("データの取得中にエラー:", err);
      setError("データを取得できませんでした。");
    }
  };

  useEffect(() => {
    fetchDiagnosisResult();
  }, [router]); // router が初期化された後に fetchDiagnosisResult を実行

  return (
    <>
      {error == null ? <></> : <FlowbitAlertError msg={error} />}
      <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* 診断結果カード */}
        {diagnosisData == null ? <></> : <DiagnosisCard diagnosisData={diagnosisData} />}

        {/* 所属グループ */}
        <GroupCard />

        {/* 各種設定カード */}
        <SettingsCard session={session} setProcessing={setProcessing} />
      </div>
    </>
  );
}
