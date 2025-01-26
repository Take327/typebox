import { convertScoreToDiagnosisResult } from "../../../lib/convertScoreToDiagnosisResult";
import { MBTIDiagnosisResult, MBTIScore, Question } from "../../../types";

/**
 * ユーザーの回答をもとにMBTIタイプを判定する関数（1～5スケール対応）
 * @param {Question[]} questions - 診断の質問リスト
 * @param {number[]} answers - 各質問へのユーザーの回答（1～5）
 * @returns {MBTIDiagnosisResult}
 */
export const calculateMBTIType = (questions: Question[], answers: number[]): MBTIDiagnosisResult => {
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

  const sumScores: MBTIScore = createInitialScores();
  const maxScores: MBTIScore = createInitialScores();

  questions.forEach((question, index) => {
    const answer = answers[index];
    const type = question.type;
    const weight = question.weight;

    sumScores[type] += answer * weight;
    maxScores[type] += 4 * weight;
  });

  // 2) ratio: 各タイプの (合計得点 / 最大得点) を % に変換
  //   小数点以下切り捨ての場合は Math.floor を使用
  const ratio: MBTIScore = createInitialScores();
  (Object.keys(sumScores) as (keyof typeof sumScores)[]).forEach((t) => {
    ratio[t] = Math.floor((sumScores[t] / maxScores[t]) * 100);
  });

  return convertScoreToDiagnosisResult(ratio);
};
