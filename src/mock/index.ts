import { DiagnosisData, Group } from "../types";

export const diagnosisData: DiagnosisData = {
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

export const groupsData: Group[] = [
  { id: "group-a", name: "グループA", members: 10, role: "管理者" },
  { id: "group-b", name: "グループB", members: 8, role: "メンバー" },
  { id: "group-c", name: "グループC", members: 15, role: "メンバー" },
  { id: "group-d", name: "グループD", members: 20, role: "管理者" },
  { id: "group-e", name: "グループE", members: 5, role: "メンバー" },
  { id: "group-f", name: "グループF", members: 12, role: "管理者" },
  { id: "group-g", name: "グループG", members: 7, role: "メンバー" },
  { id: "group-h", name: "グループH", members: 9, role: "メンバー" },
  { id: "group-i", name: "グループI", members: 25, role: "管理者" },
  { id: "group-j", name: "グループJ", members: 14, role: "メンバー" },
  { id: "group-k", name: "グループK", members: 18, role: "管理者" },
  { id: "group-l", name: "グループL", members: 3, role: "メンバー" },
  { id: "group-m", name: "グループM", members: 11, role: "メンバー" },
  { id: "group-n", name: "グループN", members: 6, role: "メンバー" },
  { id: "group-o", name: "グループO", members: 13, role: "管理者" },
  { id: "group-p", name: "グループP", members: 4, role: "メンバー" },
  { id: "group-q", name: "グループQ", members: 8, role: "メンバー" },
  { id: "group-r", name: "グループR", members: 19, role: "管理者" },
  { id: "group-s", name: "グループS", members: 17, role: "メンバー" },
  { id: "group-t", name: "グループT", members: 21, role: "管理者" },
];
