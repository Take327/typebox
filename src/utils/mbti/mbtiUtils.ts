// src/utils/mbtiUtils.ts
import { MBTIBias, MBTIDiagnosisResult, MBTIScore, MBTIType } from "../../types";

/**
 * MBTIタイプを判定する関数
 * @param {MBTIScore} ratio - 各MBTI要素のスコア割合
 * @returns {MBTIType} 判定されたMBTIタイプ
 */
export const getMBTIType = (ratio: MBTIScore): MBTIType => {
  const eOrI = ratio.E >= ratio.I ? "E" : "I";
  const sOrN = ratio.S >= ratio.N ? "S" : "N";
  const tOrF = ratio.T >= ratio.F ? "T" : "F";
  const jOrP = ratio.J >= ratio.P ? "J" : "P";
  return `${eOrI}${sOrN}${tOrF}${jOrP}` as MBTIType;
};

/**
 * MBTIのバイアス（スコア差）を計算する関数
 * @param {MBTIScore} ratio - 各MBTI要素のスコア割合
 * @returns {MBTIBias} 各ペアのスコア差
 */
export const getMBTIBias = (ratio: MBTIScore): MBTIBias => {
  return {
    EvsI: ratio.I - ratio.E,
    SvsN: ratio.N - ratio.S,
    TvsF: ratio.F - ratio.T,
    JvsP: ratio.P - ratio.J,
  };
};

/**
 * MBTIScore を MBTIDiagnosisResult に変換する関数
 * @param {MBTIScore} score - スコア割合
 * @returns {MBTIDiagnosisResult} 診断結果
 */
export const convertScoreToDiagnosisResult = (score: MBTIScore): MBTIDiagnosisResult => {
  return {
    type: getMBTIType(score),
    bias: getMBTIBias(score),
    ratio: score,
  };
};
