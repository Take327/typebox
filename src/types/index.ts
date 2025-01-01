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