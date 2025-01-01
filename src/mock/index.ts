import { DiagnosisData } from "../types";

export const diagnosisData:DiagnosisData = {
  mbtiType: "INFJ",
  traits: "思慮深く理想主義的。周囲の人々を深く理解し、感情を大切にします。",
  tendencies: [
    {
      labelMinus: "外向型(E)",
      labelPlus: "内向型(I)",
      value: 20,
      color: "#3498db",
    },
    {
      labelMinus: "感覚型(S)",
      labelPlus: "直観型(N)",
      value: -40,
      color: "#2ecc71",
    },
    {
      labelMinus: "思考型(T)",
      labelPlus: "感情型(F)",
      value: 10,
      color: "#f1c40f",
    },
    {
      labelMinus: "判断型(J)",
      labelPlus: "知覚型(P)",
      value: -30,
      color: "#e67e22",
    },
  ],
};
