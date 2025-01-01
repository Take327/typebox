"client use";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/options"; // 正しいパスを指定
import { redirect } from "next/navigation";
import Link from "next/link";
import { Progress } from "flowbite-react";

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

  const tendencies = [
    { label: "外向型（E） - 内向型（I）", value: 60 },
    { label: "感覚型（S） - 直観型（N）", value: 40 },
    { label: "思考型（T） - 感情型（F）", value: 70 },
    { label: "判断型（J） - 知覚型（P）", value: 50 },
  ];

  return (
    <div className="p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {/* 診断開始/再開ボタン */}
      <Card>
        <h2 className="text-xl font-bold mb-4 text-gray-800">診断結果</h2>

        {/* MBTIタイプと特徴 */}
        <p className="text-gray-600 mb-2">
          現在のMBTIタイプ: <strong>INFJ</strong>
        </p>
        <p className="text-sm text-gray-400 mb-2">
          特徴: 思慮深く理想主義的。周囲の人々を深く理解し、感情を大切にします。
        </p>

        <div className="w-full">
          {tendencies.map((tendency, index) => (
            <div key={index} className="mb-6">
              <p className="text-sm font-semibold text-gray-800 mb-1">
                {tendency.label}
              </p>
              <div className="relative w-full h-4 bg-gray-200 rounded-full">
                <div
                  className={`absolute h-4 bg-blue-500 rounded-full`}
                  style={{
                    left: "50%",
                    width: `${Math.abs(tendency.value)}%`,
                    transform:
                      tendency.value < 0
                        ? "translateX(-100%)"
                        : "translateX(0)",
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 text-center mt-1">
                {tendency.value > 0
                  ? `${tendency.value}% 内向型`
                  : `${Math.abs(tendency.value)}% 外向型`}
              </p>
            </div>
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
        <h2 className="text-xl font-bold mb-4 text-gray-800">所属グループ</h2>
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
        <h2 className="text-xl font-bold mb-4 text-gray-800">通知と設定</h2>
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
