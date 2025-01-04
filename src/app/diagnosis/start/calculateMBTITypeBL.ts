import { Question } from "../../../types";

/**
 * ユーザーの回答をもとにMBTIタイプを判定する関数
 * @param {Question[]} questions - 診断の質問リスト
 * @param {number[]} answers - 各質問へのユーザーの回答（スコア）
 * @returns {{ type: string, bias: { [key: string]: number } }} 判定されたMBTIタイプと偏りスコア
 */
export const calculateMBTIType = (
  questions: Question[],
  answers: number[]
): { type: string; bias: { [key: string]: number } } => {
  // タイプごとのスコアを初期化
  const scores: { [key: string]: number } = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };

  // 質問と回答を対応付けてスコア計算
  questions.forEach((question, index) => {
    const answer = answers[index];
    if (answer !== undefined) {
      scores[question.type] += answer * question.weight;
    }
  });

  // 各カテゴリで高いスコアのタイプを選択
  const result = [
    scores.E >= scores.I ? "E" : "I",
    scores.S >= scores.N ? "S" : "N",
    scores.T >= scores.F ? "T" : "F",
    scores.J >= scores.P ? "J" : "P",
  ];

  // 偏りスコアの計算
  const bias = {
    E: scores.E - scores.I,
    I: scores.I - scores.E,
    S: scores.S - scores.N,
    N: scores.N - scores.S,
    T: scores.T - scores.F,
    F: scores.F - scores.T,
    J: scores.J - scores.P,
    P: scores.P - scores.J,
  };

  // MBTI タイプと偏りスコアを返す
  return { type: result.join(""), bias };
};
