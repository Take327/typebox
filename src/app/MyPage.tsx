"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProcessingProvider, useProcessing } from "../context/ProcessingContext"; // ProcessingContextを利用
import { DiagnosisData } from "../types"; // 型定義を適用
import { convertToDiagnosisData } from "../utils/convertToDiagnosisData";
import Card from "./components/Card";
import Construction from "./components/Construction";
import MBTITendenciesChart from "./components/MBTITendenciesChart";

export default function MyPage() {
  const { setProcessing } = useProcessing(); // ProcessingContextから状態を管理
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiagnosisData = async () => {
      try {
        setProcessing(true); // 処理中状態を設定
        const response = await fetch("/api/diagnosisResult");

        if (!response.ok) {
          throw new Error(`エラーが発生しました: ${response.statusText}`);
        }

        const result = await response.json();
        const transformedData = convertToDiagnosisData(result); // データを変換
        setDiagnosisData(transformedData); // データを設定
      } catch (err) {
        console.error("診断データの取得中にエラー:", err);
        setError("診断データを取得できませんでした。");
      } finally {
        setProcessing(false); // 処理終了
      }
    };

    fetchDiagnosisData();
    // 依存配列を空にして、初回レンダリング時のみ実行
  }, []);

  return (
    <ProcessingProvider>
      <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* 診断開始/再開ボタン */}
        <Card title="診断結果">
          {(() => {
            if (error) {
              return (
                <Link href="/diagnosis/start" className="mt-auto">
                  <button className="px-4 py-2 text-white rounded bg-a8d8cb hover:bg-a8d8cb/90">診断を開始する</button>
                </Link>
              );
            } else {
              return (
                <>
                  <p className="mb-2 text-gray-600">
                    現在のMBTIタイプ: <strong>{diagnosisData?.mbtiType}</strong>
                  </p>
                  <p className="mb-2 text-sm text-gray-400">特徴: {diagnosisData?.traits}</p>
                  <div className="w-full">
                    {diagnosisData?.tendencies.map((tendency, index) => (
                      <MBTITendenciesChart tendency={tendency} key={index} />
                    ))}
                  </div>
                  <Link href="/diagnosis/start" className="mt-auto">
                    <button className="px-4 py-2 text-white rounded bg-a8d8cb hover:bg-a8d8cb/90">
                      診断を開始する
                    </button>
                  </Link>
                </>
              );
            }
          })()}
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
