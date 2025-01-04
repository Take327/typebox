export type MBTITendency = {
  labelMinus: "外向型(E)" | "感覚型(S)" | "思考型(T)" | "判断型(J)";
  labelPlus: "内向型(I)" | "直観型(N)" | "感情型(F)" | "知覚型(P)";
  value: number;
  color: string;
};

export type DiagnosisData = {
  mbtiType: string;
  traits: string;
  tendencies: MBTITendency[];
};

export type Group = {
  id: string;       // グループの一意の識別子
  name: string;     // グループ名
  members: number;  // メンバー数
  role: "管理者" | "メンバー"; // グループ内の役割
};

export type Question = {
  id: number;
  text: string;
  type: "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";
  weight: 1|2; // 質問の重み
};