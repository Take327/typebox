import { MBTIType } from "@/types";

// 相性スコアのラベル変換
export const compatibilityLabels: Record<number, string> = {
  4: "Best",
  3: "Better",
  2: "Good",
  1: "Bad",
};

/** MBTIタイプ間の相性スコア（1: Bad ～ 4: Best） */
export const mbtiRelations: Record<string, Record<string, number>> = {
  ENTP: { ESFJ: 4, ISFP: 3, INTJ: 2, ISFJ: 1 },
  ISFP: { INTJ: 4, ESFJ: 3, ENTJ: 2, ESTJ: 1 },
  ESFJ: { INTJ: 4, INTP: 3, ISTP: 2, ENFP: 1 },
  INTJ: { ESFP: 4, ISTP: 3, ENFJ: 2, INFJ: 1 },
  ISTP: { ENFP: 4, INFJ: 3, ESTJ: 2, ENFJ: 1 },
  INFJ: { ISTP: 4, ESTP: 3, ENFJ: 2, INFP: 1 },
  ESTP: { INFP: 4, ENFJ: 3, ENTJ: 2, ESFP: 1 },
  ENFJ: { INFP: 4, ISTJ: 3, ENTJ: 2, ISFP: 1 },
  INFP: { ESTJ: 4, ENTP: 3, ENFJ: 2, ISTJ: 1 },
  ESTJ: { ISTJ: 4, ENFP: 3, INTP: 2, ESFP: 1 },
  ISTJ: { ENFP: 4, ISFJ: 3, INFJ: 2, ESTP: 1 },
  ISFJ: { ENTP: 4, ESTP: 3, INTJ: 2, ESFJ: 1 },
  ESFP: { ESTP: 4, ISFP: 3, ENFJ: 2, INFJ: 1 },
  ENTJ: { ENFP: 4, ISTP: 3, ESTJ: 2, INFP: 1 },
  ENFP: { ENTJ: 4, ISFJ: 3, ESFP: 2, ESTP: 1 },
  INTP: { ESFJ: 4, ISTJ: 3, ENFP: 2, ISFP: 1 },
};
