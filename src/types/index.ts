/**
 * MBTIのタイプを表す型。
 *
 * MBTIタイプは16種類の4文字型から成り、例えば "ESTJ" や "INFP" など。
 */
export type MBTIType =
  | "ESTJ"
  | "ESTP"
  | "ESFJ"
  | "ESFP"
  | "ENTJ"
  | "ENTP"
  | "ENFJ"
  | "ENFP"
  | "ISTJ"
  | "ISTP"
  | "ISFJ"
  | "ISFP"
  | "INTJ"
  | "INTP"
  | "INFJ"
  | "INFP";

/**
 * MBTIタイプの構成要素を表す型。
 *
 * 各MBTIタイプは "E"（外向型）や "I"（内向型）などの8つの構成要素から成る。
 */
export type EISNTFJP = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

/**
 * MBTI傾向を表す型。
 *
 * 各MBTI傾向は、マイナス方向とプラス方向のラベル、傾向値、および表示色を含む。
 */
export type MBTITendency = {
  labelMinus: "外向型(E)" | "感覚型(S)" | "思考型(T)" | "判断型(J)";
  labelPlus: "内向型(I)" | "直観型(N)" | "感情型(F)" | "知覚型(P)";
  value: number; // 傾向値
  color: string; // 表示色
};

/**
 * 診断データを表す型。
 *
 * MBTIタイプ、特徴説明、および傾向データを含む。
 */
export type DiagnosisData = {
  mbtiType: MBTIType; // MBTIのタイプ
  traits: string; // 特徴説明
  tendencies: MBTITendency[]; // 傾向データ
};

/**
 * グループ情報を表す型。
 *
 * グループには一意の識別子、名前、メンバー数、および役割が含まれる。
 */
export type Group = {
  id: string; // グループの一意の識別子
  name: string; // グループ名
  members: number; // メンバー数
  role: "管理者" | "メンバー"; // グループ内での役割
};

/**
 * 診断質問を表す型。
 *
 * 質問には一意のID、質問文、対応するMBTI構成要素、および質問の重みが含まれる。
 */
export type Question = {
  id: number; // 質問の一意の識別子
  text: string; // 質問文
  type: EISNTFJP; // 質問が対応するMBTI構成要素
  weight: 1 | 2; // 質問の重み（1または2）
};

/**
 * MBTIバイアス（スコア差）を表す型。
 *
 * 各ペア（EvsI, SvsN, TvsF, JvsP）のスコア差を表す。
 */
export type MBTIBias = {
  EvsI: number; // E（外向型）とI（内向型）のスコア差
  SvsN: number; // S（感覚型）とN（直観型）のスコア差
  TvsF: number; // T（思考型）とF（感情型）のスコア差
  JvsP: number; // J（判断型）とP（知覚型）のスコア差
};

/**
 * MBTIスコアを表す型。
 *
 * 各構成要素（E, I, S, N, T, F, J, P）のスコアを含む。
 */
export type MBTIScore = {
  [key in EISNTFJP]: number;
};

/**
 * 診断結果を表す型。
 *
 * 診断結果にはMBTIタイプ、各ペアのスコア差、および各構成要素のスコア割合が含まれる。
 */
export type MBTIDiagnosisResult = {
  type: MBTIType; // "ESTJ" などの4文字MBTIタイプ
  bias: MBTIBias; // ペアごとのスコア差
  ratio: MBTIScore; // 各タイプのスコア割合（%）
};

type Notification = {
  id: string;
  message: string;
  isRead: boolean;
};

type NotificationListProps = {
  notifications: Notification[];
};
