"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useProcessing } from "../../context/ProcessingContext";
import DiagnosisCard from "./card/DiagnosisCard";
import GroupCard from "./card/GroupCard";
import SettingsCard from "./card/SettingsCard";

/**
 * マイページを表示するコンポーネント。
 *
 * 子コンポーネントとして
 * - 診断結果: <DiagnosisCard />
 * - 所属グループ: <GroupCard />
 * - 各種設定: <SettingsCard />
 * を呼び出します。
 */
export default function MyPage(): React.JSX.Element {
  const { setProcessing } = useProcessing();
  const { data: session } = useSession();

  return (
    <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* 診断結果カード */}
      <DiagnosisCard session={session} setProcessing={setProcessing} />

      {/* 所属グループ */}
      <GroupCard />

      {/* 各種設定カード */}
      <SettingsCard session={session} setProcessing={setProcessing} />
    </div>
  );
}
