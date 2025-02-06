"use client";

import React, { useEffect } from "react";
import { useUserData } from "@/hooks/useUserData";
import { useGroups } from "@/hooks/useGroups";
import { useDiagnosisData } from "@/hooks/useDiagnosisData";
import { useProcessing } from "@/context/ProcessingContext";
import DiagnosisCard from "./card/DiagnosisCard";
import GroupCard from "./card/GroupCard";
import NoDiagnosisCard from "./card/NoDiagnosisCard";
import DiagnosisListCard from "./card/DiagnosisListCard";

/**
 * マイページコンポーネント
 */
export default function MyPage(): React.JSX.Element {
  const userData = useUserData();
  const { groups, error } = useGroups(userData?.id || null);
  const { diagnosisData, diagnosisHistory } = useDiagnosisData(userData?.id || null);
  const { setProcessing } = useProcessing(); // グローバルローディング状態管理

  // ローディングの状態を適切に制御
  useEffect(() => {
    if (!userData || !groups || !diagnosisData) {
      setProcessing(true); // データ未取得時はローディングを開始
    } else {
      setProcessing(false); // すべてのデータ取得後にローディングを解除
    }
  }, [userData, groups, diagnosisData, setProcessing]);

  // エラー発生時の表示
  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600 font-semibold">エラー: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* 診断データ */}
      {diagnosisData ? <DiagnosisCard diagnosisData={diagnosisData} /> : <NoDiagnosisCard />}
      {/* 診断履歴一覧 */}
      <DiagnosisListCard rawData={diagnosisHistory} />
      {/* 所属グループ */}
      <GroupCard groups={groups.slice(0, 4)} />
    </div>
  );
}
