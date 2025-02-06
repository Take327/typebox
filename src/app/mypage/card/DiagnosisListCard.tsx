"use client";

import React from "react";
import Card from "../../components/Card";
import { MBTITransitionChart } from "../../components/MBTITransitionChart";
import { MBTIScore } from "@/types";

/**
 * 診断結果の遷移を表示するカードコンポーネント。
 *
 * - ユーザーの過去の MBTI 診断結果の変化を視覚化する
 * - `MBTITransitionChart` コンポーネントを使用してチャートを描画
 * - `Card` コンポーネントでラップし、統一感のあるデザインを提供
 *
 * @returns {JSX.Element} 診断結果遷移カードの JSX 要素
 */
export default function DiagnosisListCard({ rawData }: { rawData: Array<{ date: string } & MBTIScore> }): JSX.Element {
  return (
    <Card title="診断結果遷移">
      <MBTITransitionChart rawData={rawData} />
    </Card>
  );
}
