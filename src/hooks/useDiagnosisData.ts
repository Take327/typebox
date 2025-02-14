import { useEffect, useState } from "react";
import { DiagnosisData, MBTIDiagnosisResultFromServer, MBTIDiagnosisResult, MBTIScore, isMBTIType } from "@/types";
import { formatDiagnosisData } from "@/utils/formatDiagnosisData";
import { useProcessing } from "@/context/ProcessingContext";

/**
 * @description ユーザーの診断結果と診断履歴を取得するカスタムフック
 */
export function useDiagnosisData(userId: number | null) {
  const { setProcessing } = useProcessing();
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData | null>(null);
  const [diagnosisHistory, setDiagnosisHistory] = useState<Array<{ date: string } & MBTIScore>>([]);

  async function fetchDiagnosisResult() {
    if (!userId) return;
    setProcessing(true);

    try {
      const response = await fetch("/api/diagnosisResult", {
        method: "GET",
        headers: { "x-user-id": String(userId) },
      });

      if (!response.ok) throw new Error("診断結果の取得に失敗しました");

      const result: MBTIDiagnosisResultFromServer = await response.json();
      console.log("診断結果取得:", result);

      if (!result || result.initialLogin) return;

      if (!isMBTIType(result.type)) {
        throw new Error(`未知のMBTIタイプが返却されました: ${result.type}`);
      }

      const typedResult: MBTIDiagnosisResult = {
        type: result.type as MBTIDiagnosisResult["type"],
        ratio: result.ratio,
        bias: result.bias,
      };

      console.log(typedResult);
      setDiagnosisData(formatDiagnosisData(typedResult));
    } catch (err) {
      console.error("診断データ取得エラー:", err);
    } finally {
      setProcessing(false);
    }
  }

  async function fetchDiagnosisHistory() {
    try {
      if (!userId) return;
      const response = await fetch("/api/diagnosisListResult", {
        method: "GET",
        headers: { "x-user-id": String(userId) },
      });

      if (!response.ok) throw new Error("診断履歴の取得に失敗しました");

      const historyData: Array<{ date: string } & MBTIScore>[] = await response.json();

      console.log(historyData);

      setDiagnosisHistory(historyData.flat());
    } catch (err) {
      console.error("診断履歴取得エラー:", err);
    }
  }

  useEffect(() => {
    if (!userId) return;
    fetchDiagnosisResult();
    fetchDiagnosisHistory();
  }, [userId]);

  return { diagnosisData, diagnosisHistory };
}
