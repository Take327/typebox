"use client";

import { useProcessing } from "@/context/ProcessingContext";
import { useDiagnosisData } from "@/hooks/useDiagnosisData";
import { useGroups } from "@/hooks/useGroups";
import { useUserData } from "@/hooks/useUserData";
import React, { useEffect } from "react";
import DiagnosisCard from "./card/DiagnosisCard";
import DiagnosisListCard from "./card/DiagnosisListCard";
import GroupCard from "./card/GroupCard";
import NoDiagnosisCard from "./card/NoDiagnosisCard";

/**
 * マイページコンポーネント
 */
export default function MyPage(): React.JSX.Element {
  const userData = useUserData();
  const userId = Number.isFinite(userData?.id) ? userData.id : null;
  const { groups, error } = useGroups(userId);
  const { diagnosisData, diagnosisHistory } = useDiagnosisData(userId);
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
    <>
      {!diagnosisData ? (
        <div className="grid grid-cols-1 gap-6 p-6">
          <NoDiagnosisCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* 診断データ */}
          <DiagnosisCard diagnosisData={diagnosisData} />
          {/* 診断履歴一覧 */}
          <DiagnosisListCard rawData={Array.isArray(diagnosisHistory) ? diagnosisHistory : []} />
          {/* 所属グループ */}
          <GroupCard groups={Array.isArray(groups) ? groups.slice(0, 4) : []} />
        </div>
      )}
    </>
  );
}
