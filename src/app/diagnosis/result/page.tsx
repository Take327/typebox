"use client";

import { Card } from "flowbite-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DiagnosisData } from "../../../types";
import { convertToDiagnosisData } from "../../../utils/convertToDiagnosisData";
import MBTITendenciesChart from "../../components/MBTITendenciesChart";

export default function Page() {
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // データを取得する非同期関数
    const fetchDiagnosisData = async () => {
      try {
        const response = await fetch("/api/diagnosisResult");

        if (!response.ok) {
          throw new Error(`エラーが発生しました: ${response.statusText}`);
        }

        const result = await response.json();
        const transformedData = convertToDiagnosisData(result); // データを変換
        setDiagnosisData(transformedData);
      } catch (err) {
        console.error("診断データの取得中にエラー:", err);
        setError("診断データを取得できませんでした。");
      }
    };

    fetchDiagnosisData();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="mb-4 text-center text-2xl font-bold">MBTI 診断結果</h1>
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

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
        {/* MBTIタイプと特徴 */}
        <p className="mb-2 text-gray-600">
          あなたのMBTIタイプ: <strong>{diagnosisData.mbtiType}</strong>
        </p>
        <p className="mb-2 text-sm text-gray-400">特徴: {diagnosisData.traits}</p>

        {/* 傾向チャート */}
        <div className="w-full max-w-[40vw]">
          {diagnosisData.tendencies.map((tendency, index) => (
            <MBTITendenciesChart tendency={tendency} key={index} />
          ))}
        </div>

        {/* 診断開始ボタン */}
        <Link href="/" className="mt-auto">
          <button className="rounded bg-81d8d0 px-4 py-2 text-white hover:bg-81d8d0/90">ホームに戻る</button>
        </Link>
      </Card>
    </div>
  );
}
