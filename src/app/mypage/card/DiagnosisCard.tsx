"use client";
import React from "react";
import Link from "next/link";
import Card from "../../components/Card";
import MBTITendenciesChart from "../../components/MBTITendenciesChart";
import { DiagnosisData } from "../../../types";

export default function DiagnosisCard({ diagnosisData }: { diagnosisData: DiagnosisData }) {
  return (
    <Card title="診断結果">
      {diagnosisData == null ? (
        <div className="flex flex-col items-center justify-center">
          <p className="text-gray-600"></p>
          <Link href="/diagnosis/start">
            <button className="px-4 py-2 mt-4 text-white rounded bg-81d8d0 hover:bg-81d8d0/90">診断を開始する</button>
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-2 text-gray-600">
            現在のMBTIタイプ: <strong>{diagnosisData.mbtiType}</strong>
          </p>
          <p className="mb-2 text-sm text-gray-400">特徴: {diagnosisData?.traits}</p>

          {/* 傾向をグラフ表示 */}
          <div className="w-full">
            {diagnosisData?.tendencies?.map((tendency, index) => (
              <MBTITendenciesChart tendency={tendency} key={index} />
            ))}
          </div>

          <Link href="/diagnosis/start">
            <button className="bg-accent hover:bg-accent-dark px-4 py-2 mt-4 text-white rounded ">
              診断を開始する
            </button>
          </Link>
        </>
      )}
    </Card>
  );
}
