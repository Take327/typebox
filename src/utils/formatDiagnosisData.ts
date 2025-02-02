import { DiagnosisData, EISNTFJP_VALUES, MBTIDiagnosisResult, MBTIScore, MBTITendency, MBTIType } from "../types";

const MBTITypeJapaneseNames: {
  [key in MBTIType]: { type: string; traits: string };
} = {
  ESTJ: {
    type: "統率者",
    traits: "責任感が強く、効率的に組織を管理し、リーダーシップを発揮します。",
  },
  ESTP: {
    type: "起業家",
    traits: "行動力があり、リスクを恐れず、実践的な解決策を見つける能力があります。",
  },
  ESFJ: {
    type: "提唱者",
    traits: "協調性が高く、他者をサポートする能力に長け、コミュニティを重視します。",
  },
  ESFP: {
    type: "エンターテイナー",
    traits: "明るく社交的で、ムードメーカーとして人々を楽しませる存在です。",
  },
  ENTJ: {
    type: "指揮官",
    traits: "戦略的な思考を持ち、目標達成に向けたリーダーシップを発揮します。",
  },
  ENTP: {
    type: "発明家",
    traits: "創造性に富み、新しいアイデアや挑戦を楽しむ革新者です。",
  },
  ENFJ: {
    type: "主人公",
    traits: "カリスマ性があり、他者を引き付け導く力を持ち、影響力を発揮します。",
  },
  ENFP: {
    type: "広報",
    traits: "自由奔放で多才、好奇心旺盛で新しい可能性を追求する楽しい存在です。",
  },
  ISTJ: {
    type: "管理者",
    traits: "実直で責任感が強く、規律を守り、着実に仕事を進める信頼できる人物です。",
  },
  ISTP: {
    type: "技術者",
    traits: "柔軟性があり、実践的なスキルを持ち、効率的な解決策を提供します。",
  },
  ISFJ: {
    type: "守護者",
    traits: "思いやりがあり、他者を支え守ることに喜びを感じる、信頼できる存在です。",
  },
  ISFP: {
    type: "冒険者",
    traits: "感受性豊かで美的センスに優れ、自由を愛する創造的な個性です。",
  },
  INTJ: {
    type: "建築家",
    traits: "戦略的で洞察力があり、目標達成に向けた計画を緻密に立てます。",
  },
  INTP: {
    type: "論理学者",
    traits: "知識探求に熱心で、抽象的なアイデアや理論を好む思慮深い人物です。",
  },
  INFJ: {
    type: "助言者",
    traits: "共感力が高く、他者の成長を助ける理想主義的なカウンセラーです。",
  },
  INFP: {
    type: "仲介者",
    traits: "感受性が豊かで理想主義的、自分の価値観に忠実に行動する人物です。",
  },
};

/**
 * MBTIDiagnosisResult を DiagnosisData に変換する関数
 *
 * @param {MBTIDiagnosisResult} result - 診断結果データ
 * @returns {DiagnosisData} 変換後の診断データ
 */
export const formatDiagnosisData = (result: MBTIDiagnosisResult): DiagnosisData => {
  const tendencies: MBTITendency[] = createTendencies(result.ratio);

  return {
    mbtiType: result.type,
    traits: `あなたは ${MBTITypeJapaneseNames[result.type].type} タイプ(${result.type})です。 \n
    ${MBTITypeJapaneseNames[result.type].traits}`,
    tendencies,
  };
};

/**
 * スコア割合（MBTIScore）をもとに傾向データ（MBTITendency[]）を生成する関数
 *
 * @param {MBTIScore} score - 各構成要素のスコア割合
 * @returns {MBTITendency[]} 傾向データ
 */
const createTendencies = (score: MBTIScore): MBTITendency[] => {
  // スコアデータがすべて正しいかを検証
  EISNTFJP_VALUES.forEach((key) => {
    if (typeof score[key] !== "number") {
      console.error(`スコアデータが不正です: ${key} が存在しないか無効です`);
      score[key] = 0; // デフォルト値を設定
    }
  });

  return [
    {
      labelMinus: "外向型(E)",
      labelPlus: "内向型(I)",
      value: score.I - score.E,
      color: "#81D8D0",
    },
    {
      labelMinus: "感覚型(S)",
      labelPlus: "直観型(N)",
      value: score.N - score.S,
      color: "#F6CEB4",
    },
    {
      labelMinus: "思考型(T)",
      labelPlus: "感情型(F)",
      value: score.F - score.T,
      color: "#FAD4E0",
    },
    {
      labelMinus: "判断型(J)",
      labelPlus: "知覚型(P)",
      value: score.P - score.J,
      color: "#CDE7F4",
    },
  ];
};
