/**
 * MBTI関連の型定義
 */

/**
 * MBTIの構成要素の文字列定数。
 *
 * 例: "E"（外向型）、"I"（内向型）など。
 */
export const EISNTFJP_VALUES = ["E", "I", "S", "N", "T", "F", "J", "P"] as const;

/**
 * MBTIの構成要素を表す型。
 *
 * 定数 `EISNTFJP_VALUES` から生成されたリテラル型。
 * 例: "E", "I", "S", "N", "T", "F", "J", "P"。
 */
export type EISNTFJP = (typeof EISNTFJP_VALUES)[number];

export type DiagnosisRow = {
  type_E: number;
  type_I: number;
  type_S: number;
  type_N: number;
  type_T: number;
  type_F: number;
  type_J: number;
  type_P: number;
  // 例: user_id, created_at など必要があれば追加
};

/** MBTIの16種類のタイプを表す定数 */
export const MBTI_TYPES = [
  "ESTJ",
  "ESTP",
  "ESFJ",
  "ESFP",
  "ENTJ",
  "ENTP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISTP",
  "ISFJ",
  "ISFP",
  "INTJ",
  "INTP",
  "INFJ",
  "INFP",
] as const;

/**
 * MBTIの16種類のタイプを表す型。
 *
 * 定数 `MBTI_TYPES` から生成されたリテラル型。
 * 例: "ESTJ", "INFP" など。
 */
export type MBTIType = (typeof MBTI_TYPES)[number];

/**
 * サーバーが返してくる診断結果の型
 *   - 'type' は string で返ってきてしまう
 *   - 'ratio' と 'bias' はオブジェクト
 *   - 初回ログインなら 'initialLogin?: boolean'
 */
export type MBTIDiagnosisResultFromServer = {
  type: string; // サーバーは特に型を限定せず string で返している
  ratio: MBTIScore;
  bias: MBTIBias;
  initialLogin?: boolean;
};

/**
 * サーバーから受け取った任意の文字列が、16種類の MBTIType に含まれるか検証する型ガード
 */
export function isMBTIType(value: string): value is MBTIType {
  // MBTI_TYPES (16種類の定数配列) に含まれていれば true
  return MBTI_TYPES.includes(value as MBTIType);
}

/**
 * MBTIの傾向を表す型。
 *
 * 各傾向には、マイナス方向のラベル、プラス方向のラベル、傾向値、および表示色が含まれます。
 */
export type MBTITendency = {
  /** マイナス方向のラベル (例: "外向型(E)") */
  labelMinus: "外向型(E)" | "感覚型(S)" | "思考型(T)" | "判断型(J)";
  /** プラス方向のラベル (例: "内向型(I)") */
  labelPlus: "内向型(I)" | "直観型(N)" | "感情型(F)" | "知覚型(P)";
  /** 傾向値 */
  value: number;
  /** 表示色 */
  color: string;
};

/**
 * 診断データを表す型。
 *
 * 診断結果には、MBTIタイプ、特徴説明、および傾向データが含まれます。
 */
export type DiagnosisData = {
  /** MBTIのタイプ */
  mbtiType: MBTIType;
  /** 特徴説明 */
  traits: string;
  /** 傾向データの配列 */
  tendencies: MBTITendency[];
};

/**
 * 診断関連の型定義
 */

/**
 * 診断質問を表す型。
 *
 * 質問は、質問文、対応するMBTI構成要素、質問の重みを含みます。
 */
export type Question = {
  /** 質問の一意の識別子 */
  id: number;
  /** 質問文 */
  text: string;
  /** 質問が対応するMBTI構成要素 */
  type: EISNTFJP;
  /** 質問の重み（1または2） */
  weight: 1 | 2;
};

/**
 * MBTIバイアス（スコア差）を表す型。
 *
 * 各ペア (E vs I, S vs N, T vs F, J vs P) のスコア差を表します。
 */
export type MBTIBias = {
  /** 外向型 (E) と内向型 (I) のスコア差 */
  EvsI: number;
  /** 感覚型 (S) と直観型 (N) のスコア差 */
  SvsN: number;
  /** 思考型 (T) と感情型 (F) のスコア差 */
  TvsF: number;
  /** 判断型 (J) と知覚型 (P) のスコア差 */
  JvsP: number;
};

/**
 * MBTIスコアを表す型。
 *
 * 各構成要素（E, I, S, N, T, F, J, P）のスコアを数値で表します。
 */
export type MBTIScore = {
  /** 構成要素ごとのスコア */
  [key in EISNTFJP]: number;
};

/**
 * 診断結果を表す型。
 *
 * 診断結果には、MBTIタイプ、各ペアのスコア差、構成要素ごとのスコア割合が含まれます。
 */
export type MBTIDiagnosisResult = {
  /** 診断されたMBTIタイプ */
  type: MBTIType;
  /** 各ペアのスコア差 */
  bias: MBTIBias;
  /** 各構成要素のスコア割合（%） */
  ratio: MBTIScore;
};

/**
 * 通知を表す型。
 *
 * 通知には一意の識別子、メッセージ内容、および既読状態が含まれます。
 */
export type Notification = {
  /** 通知の一意の識別子 */
  id: string;
  /** 通知のメッセージ内容 */
  message: string;
  /** 通知が既読かどうか */
  isRead: boolean;
};

/**
 * 通知リストのプロパティを表す型。
 *
 * 通知リストは、通知の配列を含みます。
 */
export type NotificationListProps = {
  /** 通知の配列 */
  notifications: Notification[];
};

/**
 * @file group.ts
 * @description グループ関連の型定義
 */

export type Group = {
  id: string;
  name: string;
  description: string | null;
  created_at: string; // or Date
};

export type GroupMember = {
  group_id: number;
  user_id: number;
  joined_at: string; // or Date
};

export type GroupData = {
  id: number;
  name: string;
  description: string | null;
};
