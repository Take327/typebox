import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/options"; // 正しいパスを指定
import { redirect } from "next/navigation";
import Link from "next/link";
import MBTITendenciesChart from "./components/MBTITendenciesChart";
import Card from "./components/Card";
import { diagnosisData, groupsData } from "../mock";
import { AiOutlineLogout } from "react-icons/ai";

export default async function MyPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {/* 診断開始/再開ボタン */}
      <Card title="診断結果">
        {/* MBTIタイプと特徴 */}
        <p className="text-gray-600 mb-2">
          現在のMBTIタイプ: <strong>{diagnosisData.mbtiType}</strong>
        </p>
        <p className="text-sm text-gray-400 mb-2">
          特徴: {diagnosisData.traits}
        </p>

        {/* 傾向チャート */}
        <div className="w-full">
          {diagnosisData.tendencies.map((tendency, index) => (
            <MBTITendenciesChart
              labelMinus={tendency.labelMinus}
              labelPlus={tendency.labelPlus}
              color={tendency.color}
              value={tendency.value}
              key={index}
            />
          ))}
        </div>

        {/* 診断開始ボタン */}
        <Link href="/diagnosis/start" className="mt-auto">
          <button className="px-4 py-2 bg-a8d8cb text-white rounded hover:bg-a8d8cb/90">
            診断を開始する
          </button>
        </Link>
      </Card>

      {/* 所属グループ */}
      <Card title="所属グループ">
        <ul className="w-full list-none space-y-4">
          {groupsData.slice(0, 8).map((group) => (
            <li key={group.id} className="flex justify-between items-center">
              {/* グループ名リンク */}
              <Link
                href={`/groups/${group.id}`}
                className="text-gray-600 hover:text-black font-medium"
              >
                {group.name}{" "}
                <span className="text-sm text-gray-400">
                  ({group.members}人)
                </span>
              </Link>
              {/* 退会ボタン */}
              <button
                className="text-red-500 hover:text-red-700"
                aria-label={`${group.name}を退会`}
              >
                <AiOutlineLogout className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
        <Link href="/groups" className="mt-auto">
          <button className="px-4 py-2 bg-[#f6ceb4] text-black rounded hover:bg-[#f7e4c9]">
            グループ一覧を見る
          </button>
        </Link>
      </Card>

      {/* 各種設定 */}
      <Card title="通知と設定">
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
