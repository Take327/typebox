import MBTITendenciesChart from "../../components/MBTITendenciesChart";
import { Card } from "flowbite-react";
import { DiagnosisData } from "../../../types";
import {diagnosisData} from "../../../mock"

export default function Page() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">MBTI 診断結果</h1>
      <Card className="mb-6 shadow-lg">
        {/* MBTIタイプと特徴 */}
        <p className="text-gray-600 mb-2">
          あなたのMBTIタイプ: <strong>{diagnosisData.mbtiType}</strong>
        </p>
        <p className="text-sm text-gray-400 mb-2">
          特徴: {diagnosisData.traits}
        </p>

        {/* 傾向チャート */}
        <div className="w-full">
          {diagnosisData.tendencies.map((tendency, index) => (
            <MBTITendenciesChart tendency={tendency} key={index} />
          ))}
        </div>
      </Card>
    </div>
  );
}
