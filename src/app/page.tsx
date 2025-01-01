"client use";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/options"; // 正しいパスを指定
import { redirect } from "next/navigation";
import Link from "next/link";
import MBTITendenciesChart from "./components/MBTITendenciesChart";
import { MBTITendency } from "./types";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="card bg-white shadow-md rounded flex flex-col items-start p-4 aspect-square hover:shadow-lg transition-shadow duration-300">
      {children}
    </div>
  );
}

export default async function MyPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const tendencies: MBTITendency[] = [
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
  ];

  return (
    <div className="p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {/* 診断開始/再開ボタン */}
      <Card>
        <h2 className="text-xl font-bold mb-1 text-gray-800">診断結果</h2>

        {/* MBTIタイプと特徴 */}
        <p className="text-gray-600 mb-2">
          現在のMBTIタイプ: <strong>INFJ</strong>
        </p>
        <p className="text-sm text-gray-400 mb-2">
          特徴: 思慮深く理想主義的。周囲の人々を深く理解し、感情を大切にします。
        </p>

        <div className="w-full">
          {tendencies.map((tendency, index) => (
            <MBTITendenciesChart
              labelMinus={tendency.labelMinus}
              labelPlus={tendency.labelPlus}
              color={tendency.color}
              value={tendency.value}
              key={index}
            />
          ))}
        </div>

        <Link href="/diagnosis/start" className="mt-auto">
          <button className="px-4 py-2 bg-a8d8cb text-white rounded hover:bg-a8d8cb/90">
            診断を開始する
          </button>
        </Link>
      </Card>

      {/* 通知表示 */}
      <Card>
        <h2 className="text-xl font-bold mb-1 text-gray-800">所属グループ</h2>
        <ul className="list-disc pl-5 text-gray-600 mb-4">
          <li>グループA</li>
          <li>グループB</li>
          <li>グループC</li>
        </ul>
        <Link href="/groups" className="mt-auto">
          <button className="px-4 py-2 bg-f6ceb4 text-black rounded hover:bg-f7e4c9">
            グループ一覧を見る
          </button>
        </Link>
      </Card>

      {/* 各種設定 */}
      <Card>
        <h2 className="text-xl font-bold mb-1 text-gray-800">通知と設定</h2>
        <p className="text-gray-600 mb-2">
          未読通知: <strong>3件</strong>
        </p>
        <ul className="list-disc pl-5 text-gray-600 mb-4">
          <li>新しい診断が利用可能です。</li>
          <li>グループに招待されました。</li>
        </ul>
        <div className="mt-auto flex gap-2">
          <Link href="/notifications">
            <button className="px-4 py-2 bg-a8d8cb text-white rounded hover:bg-a8d8cb/90">
              通知を見る
            </button>
          </Link>
          <Link href="/profile">
            <button className="px-4 py-2 bg-f6ceb4 text-black rounded hover:bg-f7e4c9">
              設定を変更する
            </button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
