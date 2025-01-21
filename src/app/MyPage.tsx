"use client";

import { TextInput } from "flowbite-react";
import { useSession } from "next-auth/react"; // useSession をインポート
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { useProcessing } from "../context/ProcessingContext";
import { notifications } from "../mock";
import { DiagnosisData } from "../types";
import { convertToDiagnosisData } from "../utils/convertToDiagnosisData";
import Card from "./components/Card";
import Construction from "./components/Construction";
import FlowbitToggleSwitch from "./components/Flowbit/FlowbitToggleSwitch";
import MBTITendenciesChart from "./components/MBTITendenciesChart";

export default function MyPage() {
  const { setProcessing } = useProcessing();
  const { data: session, status } = useSession(); // セッション情報を取得
  const router = useRouter();
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false); // フラグを追加
  const [isEditing, setIsEditing] = useState(false); // 編集モードの状態
  const [inputValue, setInputValue] = useState(session?.user?.name || ""); // 入力値の状態

  useEffect(() => {
    // セッションデータが変更されたときに inputValue を更新
    if (session?.user?.name) {
      setInputValue(session.user.name);
    }
  }, [session?.user?.name]);

  useEffect(() => {
    if (hasFetched) return; // 既にリクエストを送信した場合は終了

    const fetchDiagnosisData = async () => {
      try {
        setProcessing(true);
        const response = await fetch("/api/diagnosisResult");

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(`エラーが発生しました: ${response.statusText}`);
        }

        const result = await response.json();
        const transformedData = convertToDiagnosisData(result);
        setDiagnosisData(transformedData);
      } catch (err) {
        console.error("診断データの取得中にエラー:", err);
        setError("診断データを取得できませんでした。");
      } finally {
        setProcessing(false);
        setHasFetched(true); // フラグを更新
      }
    };

    fetchDiagnosisData();
  }, [router, setProcessing, hasFetched]);

  const displayedNotifications = notifications.slice(0, 4);

  const handleEditClick = () => {
    setIsEditing(true); // 編集モードを有効にする
  };

  const handleSave = async (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault(); // デフォルトのイベント動作をキャンセル
    setInputValue(e.target.value);
    setIsEditing(false); // 編集モードを終了

    if (!inputValue.trim()) {
      console.error("入力値が空です。保存できません。");
      return;
    }

    try {
      // セッションのユーザー名を更新
      setInputValue(e.target.value);
    } catch (error) {
      console.error("保存中にエラーが発生しました:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* 診断結果カード */}
      <Card title="診断結果">
        {error ? (
          <Link href="/diagnosis/start" className="mt-auto">
            <button className="px-4 py-2 text-white rounded bg-81d8d0 hover:bg-81d8d0/90">診断を開始する</button>
          </Link>
        ) : (
          <>
            <p className="mb-2 text-gray-600">
              現在のMBTIタイプ: <strong>{diagnosisData?.mbtiType}</strong>
            </p>
            <p className="mb-2 text-sm text-gray-400">特徴: {diagnosisData?.traits}</p>
            <div className="w-full">
              {diagnosisData?.tendencies.map((tendency, index) => (
                <MBTITendenciesChart tendency={tendency} key={index} />
              ))}
            </div>
            <Link href="/diagnosis/start" className="mt-auto">
              <button className="px-4 py-2 text-white rounded bg-81d8d0 hover:bg-81d8d0/90">診断を開始する</button>
            </Link>
          </>
        )}
      </Card>

      {/* 所属グループ */}
      <Card title="所属グループ">
        <Construction />
      </Card>

      {/* 各種設定 */}
      <Card title="通知と設定">
        <div className="mb-4">
          <h2 className="mb-2 text-lg font-bold">未処理通知</h2>
          <ul>
            {displayedNotifications.map((notification) => (
              <li key={notification.id} className="p-2 mb-2 bg-gray-100 rounded-md">
                {notification.message}
              </li>
            ))}
          </ul>
          <a href="/notifications" className="inline-block mt-2 text-sm text-blue-500">
            すべて表示
          </a>
        </div>

        <div className="mb-4">
          <h2 className="mb-2 text-lg font-bold">アカウント情報</h2>
          <div className="flex items-center justify-between text-gray-700">
            <div className="flex items-center">
              アカウント名:
              {isEditing ? (
                <TextInput
                  type="text"
                  className="ml-3"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)} // 入力値を更新
                  onBlur={handleSave} // フォーカスを外したら保存
                  autoFocus // 自動的にフォーカスを当てる
                />
              ) : (
                <span className="ml-3">{inputValue || "未ログイン"}</span>
              )}
            </div>
            {!isEditing && (
              <button
                onClick={handleEditClick}
                className="p-2 text-gray-500 hover:text-gray-800 transition-colors"
                aria-label="アカウント名を編集する"
              >
                <BiEdit className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-bold">設定</h2>
          <div className="flex items-center">
            <label htmlFor="auto-approve" className="mr-2 text-gray-700 cursor-pointer">
              自動承認
            </label>
            <FlowbitToggleSwitch isChecked={true} />
          </div>
        </div>
      </Card>
    </div>
  );
}
