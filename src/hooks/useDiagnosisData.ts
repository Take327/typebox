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
    setProcessing(true);
    try {
      const response = await fetch("/api/diagnosisResult", { method: "GET" });
      if (!response.ok) throw new Error("診断結果の取得に失敗しました");

      const result: MBTIDiagnosisResultFromServer = await response.json();
      if (!result || result.initialLogin) return;

      // `type` のバリデーション
      if (!isMBTIType(result.type)) {
        throw new Error(`未知のMBTIタイプが返却されました: ${result.type}`);
      }

      // 型変換: `result.type` は `string` 型なので `as MBTIDiagnosisResult["type"]` でキャスト
      const typedResult: MBTIDiagnosisResult = {
        type: result.type as MBTIDiagnosisResult["type"],
        ratio: result.ratio,
        bias: result.bias,
      };

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

      const response = await fetch(`/api/diagnosisListResult?user_id=${userId}`, { method: "GET" });
      if (!response.ok) throw new Error("診断履歴の取得に失敗しました");

      const historyData: Array<{ date: string } & MBTIScore>[] = await response.json();
      setDiagnosisHistory(historyData.flat());
    } catch (err) {
      console.error("診断履歴取得エラー:", err);
    }
  }

  useEffect(() => {
    fetchDiagnosisResult();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchDiagnosisHistory();
    }
  }, [userId]);

  return { diagnosisData, diagnosisHistory };
}
