"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "../../components/Card";
import MBTITendenciesChart from "../../components/MBTITendenciesChart";
import { DiagnosisData } from "../../../types";
import { formatDiagnosisData } from "../../../utils/formatDiagnosisData";
import { Session } from "next-auth";

interface DiagnosisCardProps {
  session: Session | null; // NextAuthのSession型など適切な型に差し替えてください
  setProcessing: (processing: boolean) => void;
}

export default function DiagnosisCard({ session, setProcessing }: DiagnosisCardProps) {
  const router = useRouter();
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  /**
   * 診断結果を取得する非同期関数
   */
  const fetchDiagnosisResult = async () => {
    try {
      setProcessing(true);

      // 診断結果の取得
      const response = await fetch("/api/diagnosisResult", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // 認証エラーならログイン画面へリダイレクト
      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(`エラーが発生しました: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.initialLogin) {
        console.log("初回ログインまたは診断結果が存在しません。");
        setError("診断結果がありません。診断を開始してください。");
      } else {
        const transformedData = formatDiagnosisData(result);
        setDiagnosisData(transformedData);
      }
    } catch (err) {
      console.error("データの取得中にエラー:", err);
      setError("データを取得できませんでした。");
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (!hasFetched) {
      fetchDiagnosisResult();
      setHasFetched(true);
    }
  }, [hasFetched]);

  return (
    <Card title="診断結果">
      {error ? (
        <div className="flex flex-col items-center justify-center">
          <p className="text-gray-600">{error}</p>
          <Link href="/diagnosis/start">
            <button className="px-4 py-2 mt-4 text-white rounded bg-81d8d0 hover:bg-81d8d0/90">診断を開始する</button>
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-2 text-gray-600">
            現在のMBTIタイプ: <strong>{diagnosisData?.mbtiType}</strong>
          </p>
          <p className="mb-2 text-sm text-gray-400">特徴: {diagnosisData?.traits}</p>

          {/* 傾向をグラフ表示 */}
          <div className="w-full">
            {diagnosisData?.tendencies?.map((tendency, index) => (
              <MBTITendenciesChart tendency={tendency} key={index} />
            ))}
          </div>

          <Link href="/diagnosis/start">
            <button className="px-4 py-2 mt-4 text-white rounded bg-81d8d0 hover:bg-81d8d0/90">診断を開始する</button>
          </Link>
        </>
      )}
    </Card>
  );
}
