"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useProcessing } from "../context/ProcessingContext";
import { notifications } from "../mock";
import { DiagnosisData } from "../types";
import { convertToDiagnosisData } from "../utils/convertToDiagnosisData";
import Card from "./components/Card";
import Construction from "./components/Construction";
import FlowbitToggleSwitch from "./components/Flowbit/FlowbitToggleSwitch";
import MBTITendenciesChart from "./components/MBTITendenciesChart";

export default function MyPage() {
  const { setProcessing } = useProcessing();
  const router = useRouter();
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false); // フラグを追加

  useEffect(() => {
    if (hasFetched) return; // 既にリクエストを送信した場合は終了

    const fetchDiagnosisData = async () => {
      try {
        setProcessing(true);
        const response = await fetch("/api/diagnosisResult");

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(`エラーが発生しました: ${response.statusText}`);
        }

        const result = await response.json();
        const transformedData = convertToDiagnosisData(result);
        setDiagnosisData(transformedData);
      } catch (err) {
        console.error("診断データの取得中にエラー:", err);
        setError("診断データを取得できませんでした。");
      } finally {
        setProcessing(false);
        setHasFetched(true); // フラグを更新
      }
    };

    fetchDiagnosisData();
  }, [router, setProcessing, hasFetched]);

  const displayedNotifications = notifications.slice(0, 4);

  return (
    <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* 診断結果カード */}
      <Card title="診断結果">
        {error ? (
          <Link href="/diagnosis/start" className="mt-auto">
            <button className="px-4 py-2 text-white rounded bg-81d8d0 hover:bg-81d8d0/90">診断を開始する</button>
          </Link>
        ) : (
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
              <button className="px-4 py-2 text-white rounded bg-81d8d0 hover:bg-81d8d0/90">診断を開始する</button>
            </Link>
          </>
        )}
      </Card>

      {/* 所属グループ */}
      <Card title="所属グループ">
        <Construction />
      </Card>

      {/* 各種設定 */}
      <Card title="通知と設定">
        <div className="mb-4">
          <h2 className="mb-2 text-lg font-bold">未処理通知</h2>
          <ul>
            {displayedNotifications.map((notification) => (
              <li key={notification.id} className="p-2 mb-2 bg-gray-100 rounded-md">
                {notification.message}
              </li>
            ))}
          </ul>
          <a href="/notifications" className="inline-block mt-2 text-sm text-blue-500">
            すべて表示
          </a>
        </div>

        <div className="mb-4">
          <h2 className="mb-2 text-lg font-bold">アカウント情報</h2>
          <p className="text-gray-700">アカウント名: ユーザー名</p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-bold">設定</h2>
          <div className="flex items-center">
            <label htmlFor="auto-approve" className="mr-2 text-gray-700 cursor-pointer">
              自動承認
            </label>
            <FlowbitToggleSwitch isChecked={true} />
          </div>
        </div>
      </Card>
    </div>
  );
}
