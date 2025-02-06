"use client";

import React from "react";
import Link from "next/link";
import Card from "../../components/Card";
import MBTITendenciesChart from "../../components/MBTITendenciesChart";
import { DiagnosisData } from "../../../types";

/**
 * 診断結果を表示するカードコンポーネント。
 *
 * - ユーザーの MBTI 診断結果を表示
 * - 診断傾向をグラフ (`MBTITendenciesChart`) で可視化
 * - 診断未実施の場合は診断開始ボタンを表示
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {DiagnosisData} props.diagnosisData - ユーザーの診断結果データ
 * @returns {JSX.Element} 診断結果カードの JSX 要素
 */
export default function DiagnosisCard({ diagnosisData }: { diagnosisData: DiagnosisData }): JSX.Element {
  return (
    <Card title="診断結果">
      {diagnosisData == null ? (
        <div className="flex flex-col items-center justify-center">
          {/* 診断未実施メッセージ */}
          <p className="text-gray-600">診断がまだ実施されていません。</p>

          {/* 診断開始ボタン */}
          <Link href="/diagnosis/start">
            <button className="px-4 py-2 mt-4 text-white rounded bg-accent hover:bg-accent-dark">診断を開始する</button>
          </Link>
        </div>
      ) : (
        <div className="flex w-full h-full flex-col justify-between">
          <div>
            {/* MBTI タイプ表示 */}
            <p className="mb-2 text-gray-600">
              現在のMBTIタイプ: <strong>{diagnosisData.mbtiType}</strong>
            </p>
            <p className="mb-2 text-sm text-gray-400">特徴: {diagnosisData?.traits}</p>

            {/* 傾向をグラフで表示 */}
            <div className="w-full">
              {diagnosisData?.tendencies?.map((tendency, index) => (
                <MBTITendenciesChart tendency={tendency} key={index} />
              ))}
            </div>
          </div>

          {/* 診断を再実施するボタン */}
          <Link href="/diagnosis/start">
            <button className="bg-accent hover:bg-accent-dark px-4 py-2 mt-4 text-white rounded">診断を開始する</button>
          </Link>
        </div>
      )}
    </Card>
  );
}
