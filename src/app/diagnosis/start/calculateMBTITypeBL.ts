import { convertScoreToDiagnosisResult } from "../../../utils/mbti/mbtiUtils";
import { MBTIDiagnosisResult, MBTIScore, Question } from "../../../types";

/**
 * ユーザーの回答をもとに MBTI タイプを判定する関数（1～5 スケール対応）。
 *
 * - 各質問のタイプごとにスコアを集計し、割合を算出
 * - `convertScoreToDiagnosisResult` を用いて最終的な MBTI 診断結果を取得
 *
 * @param {Question[]} questions - 診断の質問リスト
 * @param {number[]} answers - 各質問へのユーザーの回答（1～5）
 * @returns {MBTIDiagnosisResult} 診断結果オブジェクト（MBTI タイプとスコア）
 */
export const calculateMBTIType = (questions: Question[], answers: number[]): MBTIDiagnosisResult => {
  /**
   * 初期スコアオブジェクトを作成する。
   *
   * @returns {MBTIScore} 初期化された MBTI スコア
   */
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

  /** 各 MBTI タイプの合計スコア */
  const sumScores: MBTIScore = createInitialScores();
  /** 各 MBTI タイプの最大スコア */
  const maxScores: MBTIScore = createInitialScores();

  /**
   * 各質問のスコアを計算
   * - `sumScores` に各タイプの累積スコアを加算
   * - `maxScores` には各タイプの最大可能スコア（4倍スケール）を記録
   */
  questions.forEach((question, index) => {
    const answer = answers[index];
    const type = question.type;
    const weight = question.weight;

    sumScores[type] += answer * weight;
    maxScores[type] += 4 * weight;
  });

  /** 各タイプのスコア割合を計算（合計得点 / 最大得点 の割合 %） */
  const ratio: MBTIScore = createInitialScores();
  (Object.keys(sumScores) as (keyof typeof sumScores)[]).forEach((t) => {
    ratio[t] = Math.floor((sumScores[t] / maxScores[t]) * 100);
  });

  /** 診断結果を MBTI タイプに変換 */
  return convertScoreToDiagnosisResult(ratio);
};
