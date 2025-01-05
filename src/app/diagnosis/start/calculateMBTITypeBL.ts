import { Question, MBTIDiagnosisResult } from "../../../types";

/**
 * ユーザーの回答をもとにMBTIタイプを判定する関数（1～5スケール対応）
 * @param {Question[]} questions - 診断の質問リスト
 * @param {number[]} answers - 各質問へのユーザーの回答（1～5）
 * @returns {{ type: string, bias: { [key: string]: number }, ratio: { [key: string]: number } }}
 *   - type: "ESTJ" など4文字のMBTIタイプ
 *   - bias: 各ペアにおける差分
 *   - ratio: 各タイプの得点割合（%）
 */
export const calculateMBTIType = (
  questions: Question[],
  answers: number[]
): MBTIDiagnosisResult => {
  // 各タイプの合計スコアを初期化
  const sumScores: { [key in Question["type"]]: number } = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };

  // 各タイプの理論上の上限スコア（weight × 5点満点）
  const maxScores: { [key in Question["type"]]: number } = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };

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
  const ratio: { [key: string]: number } = {};
  (Object.keys(sumScores) as (keyof typeof sumScores)[]).forEach((t) => {
    const rawRatio = sumScores[t] / maxScores[t]; // 0.0～1.0
    ratio[t] = Math.floor(rawRatio * 100); // % に変換して小数切り捨て
  });

  // 3) 各ペア比較とバイアス(差分)の算出
  // E vs I
  const eOrI = ratio.E >= ratio.I ? "E" : "I";
  const diffEI = Math.abs(ratio.E - ratio.I);

  // S vs N
  const sOrN = ratio.S >= ratio.N ? "S" : "N";
  const diffSN = Math.abs(ratio.S - ratio.N);

  // T vs F
  const tOrF = ratio.T >= ratio.F ? "T" : "F";
  const diffTF = Math.abs(ratio.T - ratio.F);

  // J vs P
  const jOrP = ratio.J >= ratio.P ? "J" : "P";
  const diffJP = Math.abs(ratio.J - ratio.P);

  const type = `${eOrI}${sOrN}${tOrF}${jOrP}`;

  // 4) バイアス(bias)オブジェクトを作成（例: "EvsI": 10, "SvsN": 5, ... ）
  const bias = {
    EvsI: diffEI,
    SvsN: diffSN,
    TvsF: diffTF,
    JvsP: diffJP,
  };

  return { type, bias, ratio };
};
