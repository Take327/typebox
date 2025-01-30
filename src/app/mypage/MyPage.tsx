"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useProcessing } from "../../context/ProcessingContext";
import DiagnosisCard from "./card/DiagnosisCard";
import GroupCard from "./card/GroupCard";
import SettingsCard from "./card/SettingsCard";
import { DiagnosisData, EISNTFJP_VALUES, MBTIScore } from "@/types";
import { useRouter } from "next/navigation";
import { formatDiagnosisData } from "@/utils/formatDiagnosisData";
import { convertScoreToDiagnosisResult } from "@/utils/mbti/mbtiUtils";
import NoDiagnosisCard from "./card/NoDiagnosisCard";

export default function MyPage(): React.JSX.Element {
  const { setProcessing } = useProcessing();
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [autoApproval, setAutoApproval] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isValidScore = (score: unknown): score is MBTIScore => {
    return (
      typeof score === "object" &&
      score !== null &&
      EISNTFJP_VALUES.every((key) => typeof (score as Record<string, unknown>)[key] === "number")
    );
  };

  const fetchDiagnosisResult = async () => {
    setProcessing(true);
    try {
      const response = await fetch("/api/diagnosisResult", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`エラー: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (!result) throw new Error("診断結果が見つかりません");

      if (result.initialLogin) {
        console.warn("初回ログインのため診断結果なし。");
        return;
      }

      if (!isValidScore(result)) throw new Error("診断データのスコアが無効です");

      setDiagnosisData(formatDiagnosisData(convertScoreToDiagnosisResult(result)));
    } catch (err) {
      console.error("診断データの取得に失敗:", err);
      setError("診断データを取得できませんでした。");
    } finally {
      setProcessing(false);
    }
  };

  const fetchInitialSettings = async () => {
    try {
      if (!session) {
        router.push("/login");
        return;
      }

      const userResponse = await fetch(`/api/users?email=${session.user?.email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!userResponse.ok) throw new Error("ユーザー情報の取得に失敗しました。");

      const userData = await userResponse.json();
      if (!userData) {
        router.push("/login");
        return;
      }

      setAutoApproval(userData.autoApproval);
    } catch (err) {
      console.error("初期設定の取得エラー:", err);
    }
  };

  useEffect(() => {
    if (status !== "authenticated") return; // 未ログインなら処理しない

    let isMounted = true;
    setIsLoading(true); // ✅ データ取得開始前にローディング開始

    const fetchData = async () => {
      try {
        await fetchDiagnosisResult();
        await fetchInitialSettings();
      } catch (error) {
        console.error("データ取得中にエラー:", error);
        setError("データの取得に失敗しました。");
      } finally {
        if (isMounted) setIsLoading(false); // ✅ データ取得完了後にローディング終了
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [status]);

  return (
    <>
      {isLoading ? ( // ✅ 非同期処理中はローディング表示
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      ) : diagnosisData == null ? ( // ✅ データがない場合は `NoDiagnosisCard`
        <NoDiagnosisCard />
      ) : (
        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* 診断データ */}
          <DiagnosisCard diagnosisData={diagnosisData} />
          {/* 所属グループ */}
          <GroupCard />
          {/* 各種設定カード */}
          <SettingsCard
            session={session}
            setProcessing={setProcessing}
            autoApproval={autoApproval}
            setAutoApproval={setAutoApproval}
          />
        </div>
      )}
    </>
  );
}
