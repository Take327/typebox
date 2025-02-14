"use client";

import { useUserData } from "@/hooks/useUserData";
import { Card } from "flowbite-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DiagnosisData } from "../../../types";
import { formatDiagnosisData } from "../../../utils/formatDiagnosisData";
import MBTITendenciesChart from "../../components/MBTITendenciesChart";

/**
 * MBTI 診断結果ページ。
 *
 * - 診断 API から MBTI 診断結果を取得し、表示
 * - `formatDiagnosisData` を用いてデータを整形
 * - `MBTITendenciesChart` により診断傾向をグラフ表示
 *
 * @returns {JSX.Element} 診断結果ページの JSX 要素
 */
export default function Page(): JSX.Element {
  const userData = useUserData();
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDiagnosisData = async () => {
    if (!userData?.id) {
      console.warn("userId is null, skipping fetchDiagnosisData");
      return;
    }

    try {
      console.log("Fetching diagnosis data for userId:", userData.id);
      const response = await fetch("/api/diagnosisResult", {
        method: "GET",
        headers: { "x-user-id": String(userData.id) },
      });

      if (!response.ok) {
        throw new Error(`エラーが発生しました: ${response.statusText}`);
      }

      const result = await response.json();
      const transformedData = formatDiagnosisData(result);
      setDiagnosisData(transformedData);
    } catch (err) {
      console.error("診断データの取得中にエラー:", err);
      setError("診断データを取得できませんでした。");
    }
  };

  useEffect(() => {
    if (userData?.id) {
      fetchDiagnosisData();
    }
  }, [userData]);

  /** エラー発生時の UI */
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="mb-4 text-center text-2xl font-bold">MBTI 診断結果</h1>
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  /** データ読み込み中の UI */
  if (!diagnosisData) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="mb-4 text-center text-2xl font-bold">MBTI 診断結果</h1>
        <p className="text-center text-gray-500">データを読み込んでいます...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-center text-2xl font-bold">MBTI 診断結果</h1>
      <Card className="mb-6 shadow-lg">
        <div className="flex flex-col w-full justify-center items-center">
          {/* MBTIタイプと特徴 */}
          <p className="mb-2 text-gray-600">
            あなたのMBTIタイプ: <strong>{diagnosisData.mbtiType}</strong>
          </p>
          <p className="mb-2 text-sm text-gray-400">特徴: {diagnosisData.traits}</p>

          {/* 診断傾向チャート */}
          <div className="w-full max-w-[40vw]">
            {diagnosisData.tendencies.map((tendency, index) => (
              <MBTITendenciesChart tendency={tendency} key={index} />
            ))}
          </div>
        </div>
        <div className="flex flex-row-reverse">
          {/* ホームへ戻るボタン */}
          <Link href="/" className="mt-auto">
            <button className="rounded bg-accent hover:bg-accent-dark px-4 py-2 text-white">ホームに戻る</button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
