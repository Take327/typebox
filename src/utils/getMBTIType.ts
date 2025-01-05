import { MBTIBias, MBTIScore, MBTIType } from "../types";

/**
 * MBTIタイプを判定する関数
 *
 * 指定されたスコア割合（MBTIScore）に基づき、4文字のMBTIタイプ（MBTIType）を判定します。
 *
 * @param {MBTIScore} ratio - 各MBTI要素（E, I, S, N, T, F, J, P）のスコア割合（%）。
 * @returns {MBTIType} 判定されたMBTIタイプ（例: "ESTJ", "INFP"）。
 *
 * @example
 * const ratio = { E: 60, I: 40, S: 55, N: 45, T: 70, F: 30, J: 80, P: 20 };
 * const type = getMBTIType(ratio);
 * console.log(type); // 出力: "ESTJ"
 */
export const getMBTIType = (ratio: MBTIScore): MBTIType => {
  // E vs I
  const eOrI = ratio.E >= ratio.I ? "E" : "I";
  // S vs N
  const sOrN = ratio.S >= ratio.N ? "S" : "N";
  // T vs F
  const tOrF = ratio.T >= ratio.F ? "T" : "F";
  // J vs P
  const jOrP = ratio.J >= ratio.P ? "J" : "P";
  const type: MBTIType = `${eOrI}${sOrN}${tOrF}${jOrP}`;

  return type;
};

/**
 * MBTIの各ペアにおけるバイアス（スコア差）を計算する関数
 *
 * 指定されたスコア（MBTIScore）をもとに、MBTIの各ペア（EvsI, SvsN, TvsF, JvsP）のスコア差（バイアス）を計算します。
 *
 * @param {MBTIScore} ratio - 各MBTIタイプ（E, I, S, N, T, F, J, P）のスコア。
 * @returns {MBTIBias} 各ペアにおけるスコア差（バイアス）を含むオブジェクト。
 *
 * @example
 * const ratio = { E: 60, I: 40, S: 55, N: 45, T: 70, F: 30, J: 80, P: 20 };
 * const bias = getMBTIBias(ratio);
 * console.log(bias); // 出力: { EvsI: 20, SvsN: 10, TvsF: 40, JvsP: 60 }
 */
export const getMBTIBias = (ratio: MBTIScore): MBTIBias => {
  // E vs I
  const diffEI = Math.abs(ratio.E - ratio.I);
  // S vs N
  const diffSN = Math.abs(ratio.S - ratio.N);
  // T vs F
  const diffTF = Math.abs(ratio.T - ratio.F);
  // J vs P
  const diffJP = Math.abs(ratio.J - ratio.P);

  return {
    EvsI: diffEI,
    SvsN: diffSN,
    TvsF: diffTF,
    JvsP: diffJP,
  };
};
