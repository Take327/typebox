import { Question, MBTIDiagnosisResult, MBTIScore, MBTIBias } from "../../../types";
import { getMBTIBias, getMBTIType } from "../../../utils/getMBTIType";

/**
 * ユーザーの回答をもとにMBTIタイプを判定する関数（1～5スケール対応）
 * @param {Question[]} questions - 診断の質問リスト
 * @param {number[]} answers - 各質問へのユーザーの回答（1～5）
 * @returns {{ type: MBTIType, bias: MBTIBias, ratio: MBTIScore }}
 *   - type: "ESTJ" など4文字のMBTIタイプ
 *   - bias: 各ペアにおける差分
 *   - ratio: 各タイプの得点割合（%）
 */
export const calculateMBTIType = (questions: Question[], answers: number[]): MBTIDiagnosisResult => {
  // 初期化用のユーティリティ関数
  const createInitialScores = (): MBTIScore => ({
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  });

  // 各タイプの合計スコアを初期化
  const sumScores: MBTIScore = createInitialScores();

  // 各タイプの理論上の上限スコア（weight × 5点満点）
  const maxScores: MBTIScore = createInitialScores();

  // 各タイプの割合スコア
  const ratio: MBTIScore = createInitialScores();

  // 1) 質問と回答を対応付けて「実得点(sumScores)」「最大得点(maxScores)」を集計
  questions.forEach((question, index) => {
    const answer = answers[index]; // 0～4 のいずれか
    const type = question.type;
    const w = question.weight; // 1 or 2

    // 実際のスコア加算（回答 × weight）
    sumScores[type] += answer * w;

    // 上限スコア = 4 × weight
    maxScores[type] += 4 * w;
  });

  // 2) ratio: 各タイプの (合計得点 / 最大得点) を % に変換
  //   小数点以下切り捨ての場合は Math.floor を使用
  (Object.keys(sumScores) as (keyof typeof sumScores)[]).forEach((t) => {
    const rawRatio = sumScores[t] / maxScores[t]; // 0.0～1.0
    ratio[t] = Math.floor(rawRatio * 100); // % に変換して小数切り捨て
  });

  // 3) 各ペア比較とバイアス(差分)の算出
  const type = getMBTIType(ratio);

  // 4) バイアス(bias)オブジェクトを作成（例: "EvsI": 10, "SvsN": 5, ... ）
  const bias: MBTIBias = getMBTIBias(ratio);

  return { type, bias, ratio };
};
