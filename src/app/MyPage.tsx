"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MBTITendenciesChart from "./components/MBTITendenciesChart";
import Card from "./components/Card";
import Construction from "./components/Construction";
import { DiagnosisData } from "../types"; // 型定義を適用
import { convertToDiagnosisData } from "../utils/convertToDiagnosisData";
import { ProcessingProvider, useProcessing } from "../context/ProcessingContext"; // ProcessingContextを利用

export default function MyPage() {
  const { setProcessing } = useProcessing(); // ProcessingContextから状態を管理
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiagnosisData = async () => {
      setProcessing(true); // 処理中状態を設定（Backdropを表示）
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
      } finally {
        setProcessing(false); // 処理終了（Backdropを非表示）
      }
    };

    fetchDiagnosisData();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">エラー</h1>
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <ProcessingProvider>
      <div className="p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* 診断開始/再開ボタン */}
        <Card title="診断結果">
          <p className="text-gray-600 mb-2">
            現在のMBTIタイプ: <strong>{diagnosisData?.mbtiType}</strong>
          </p>
          <p className="text-sm text-gray-400 mb-2">
            特徴: {diagnosisData?.traits}
          </p>
          <div className="w-full">
            {diagnosisData?.tendencies.map((tendency, index) => (
              <MBTITendenciesChart tendency={tendency} key={index} />
            ))}
          </div>
          <Link href="/diagnosis/start" className="mt-auto">
            <button className="px-4 py-2 bg-a8d8cb text-white rounded hover:bg-a8d8cb/90">
              診断を開始する
            </button>
          </Link>
        </Card>

        {/* 所属グループ */}
        <Card title="所属グループ">
          <Construction />
        </Card>

        {/* 各種設定 */}
        <Card title="通知と設定">
          <Construction />
        </Card>
      </div>
    </ProcessingProvider>
  );
}
