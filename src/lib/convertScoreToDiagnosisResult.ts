import { MBTIDiagnosisResult, MBTIScore } from "@/types";
import { getMBTIBias, getMBTIType } from "@/utils/getMBTIType";

/**
 * MBTIScore を MBTIDiagnosisResult に変換する関数
 *
 * @param score - MBTIScore 型のスコア
 * @returns {MBTIDiagnosisResult} MBTIDiagnosisResult 型の診断結果
 */
export function convertScoreToDiagnosisResult(score: MBTIScore): MBTIDiagnosisResult {
  return {
    type: getMBTIType(score), // MBTIタイプを計算
    bias: getMBTIBias(score), // バイアスを計算
    ratio: score, // 各スコア割合をそのまま保持
  };
}
