"use client";

import { useEffect, useState } from "react";
import MBTITendenciesChart from "../../components/MBTITendenciesChart";
import { Card } from "flowbite-react";
import { DiagnosisData } from "../../../types";
import { convertToDiagnosisData } from "../../../utils/convertToDiagnosisData";

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
        <h1 className="text-2xl font-bold mb-4 text-center">MBTI 診断結果</h1>
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  if (!diagnosisData) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">MBTI 診断結果</h1>
        <p className="text-gray-500 text-center">データを読み込んでいます...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">MBTI 診断結果</h1>
      <Card className="mb-6 shadow-lg">
        {/* MBTIタイプと特徴 */}
        <p className="text-gray-600 mb-2">
          あなたのMBTIタイプ: <strong>{diagnosisData.mbtiType}</strong>
        </p>
        <p className="text-sm text-gray-400 mb-2">特徴: {diagnosisData.traits}</p>

        {/* 傾向チャート */}
        <div className="w-full max-w-[40vw]">
          {diagnosisData.tendencies.map((tendency, index) => (
            <MBTITendenciesChart tendency={tendency} key={index} />
          ))}
        </div>
      </Card>
    </div>
  );
}
