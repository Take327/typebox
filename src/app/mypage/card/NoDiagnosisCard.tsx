"use client";

import React from "react";
import Link from "next/link";

/**
 * 診断未実施時に表示されるカードコンポーネント。
 *
 * - ユーザーが診断を実施していない場合にメッセージを表示
 * - 診断開始ページ (`/diagnosis/start`) へのリンクを提供
 *
 * @returns {JSX.Element} 診断開始を促すカードの JSX 要素
 */
export default function NoDiagnosisCard(): JSX.Element {
  return (
    <div className="flex justify-center p-8">
      <div className="w-4/5 min-w-80 p-10 flex flex-col items-center rounded bg-white shadow-md transition-shadow duration-300 hover:shadow-lg sm:max-h-[600px] sm:max-w-[600px]">
        {/* 診断促進メッセージ */}
        <p className="text-gray-600">まずは診断してみよう！</p>

        {/* 診断開始ボタン */}
        <Link href="/diagnosis/start">
          <button className="px-4 py-2 mt-4 text-white rounded bg-[#81d8d0] hover:bg-[#81d8d0]/90">
            診断を開始する
          </button>
        </Link>
      </div>
    </div>
  );
}
