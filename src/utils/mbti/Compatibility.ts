// 相性スコアのラベル変換
export const compatibilityLabels: Record<number, string> = {
  4: "Best",
  3: "Better",
  2: "Good",
  1: "Bad",
};

/** MBTIタイプ間の相性スコア（1: Bad ～ 4: Best） */
export const mbtiRelations: Record<string, Record<string, number>> = {
  ENTP: {
    ISFP: 4, // ENTP→ISFP = Best
    ESFJ: 3,
    INTJ: 2, // ENTP→ISFJ = Good
    ISFJ: 1,
    /* 他MBTIへの相性をすべて書き込む */
  },
  ISFP: {
    ENTP: 4, // ISFP→ENTP = Best (双方向)
    INTJ: 3,
    ESFJ: 2,
    ENTJ: 1,
  },
  ESFJ: {
    INTJ: 4,
    ENTP: 3,
    ISFP: 2,
    INTP: 1,
  },
  INTJ: {
    ESFJ: 4,
    ISFP: 3,
    ENTP: 2,
    ESFP: 1,
  },
  INTP: {
    ESFP: 4,
    ISFJ: 3,
    ENTJ: 2,
    ESFJ: 1,
  },
  ESFP: {
    INTP: 4,
    ENTJ: 3,
    ISFJ: 2,
    INTJ: 1,
  },
  ISFJ: {
    ENTJ: 4,
    INTP: 3,
    ESFP: 2,
    ENTP: 1,
  },
  ENTJ: {
    ISFJ: 4,
    ESFP: 3,
    INTP: 2,
    ISFP: 1,
  },
  ISTP: {
    ENFP: 4,
    INFJ: 3,
    ESTJ: 2,
    ENFJ: 1,
  },
  ENFP: {
    ISTP: 4,
    ESTJ: 3,
    INFJ: 2,
    ISTJ: 1,
  },
  INFJ: {
    ESTJ: 4,
    ISTP: 3,
    ENFP: 2,
    ESTP: 1,
  },
  ESTJ: {
    INFJ: 4,
    ENFP: 3,
    ISTP: 2,
    INFP: 1,
  },
  ESTP: {
    INFP: 4,
    ENFJ: 3,
    ISTJ: 2,
    INFJ: 1,
  },
  INFP: {
    ESTP: 4,
    ISTJ: 3,
    ENFJ: 2,
    ESTJ: 1,
  },
  ENFJ: {
    ISTJ: 4,
    ESTP: 3,
    INFP: 2,
    ISTP: 1,
  },
  ISTJ: {
    ENFJ: 4,
    INFP: 3,
    ESTP: 2,
    ENFP: 1,
  },

  /* ... 他のMBTIについてもすべて定義する ... */
};
// 相関図に近い座標を手動で定義 (px 単位の一例)
export const MBTI_COORDS: Record<string, { x: number; y: number }> = {
  ENTP: { x: 100, y: 100 },
  ISFP: { x: 300, y: 100 },
  ESFJ: { x: 100, y: 250 },
  INTJ: { x: 300, y: 250 },
  INTP: { x: 100, y: 400 },
  ESFP: { x: 300, y: 400 },
  ISFJ: { x: 100, y: 550 },
  ENTJ: { x: 300, y: 550 },

  // 右グループ (ISTP, ENFP, INFJ, ESTJ, など)
  ISTP: { x: 600, y: 100 },
  ENFP: { x: 800, y: 100 },
  INFJ: { x: 600, y: 250 },
  ESTJ: { x: 800, y: 250 },
  ESTP: { x: 600, y: 400 },
  INFP: { x: 800, y: 400 },
  ENFJ: { x: 600, y: 550 },
  ISTJ: { x: 800, y: 550 },
};
