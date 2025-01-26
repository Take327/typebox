"use client";
import React from "react";
import { TextInput } from "flowbite-react";
import { useSession } from "next-auth/react"; // useSession をインポート
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { useProcessing } from "../context/ProcessingContext";
import { notifications } from "../mock";
import { DiagnosisData } from "../types";
import { formatDiagnosisData } from "../utils/formatDiagnosisData";
import Card from "./components/Card";
import Construction from "./components/Construction";
import FlowbitToggleSwitch from "./components/Flowbit/FlowbitToggleSwitch";
import MBTITendenciesChart from "./components/MBTITendenciesChart";

/**
 * マイページを表示するコンポーネント。
 *
 * 診断結果の表示、グループ情報の管理、通知や設定を提供します。
 *
 * @returns {JSX.Element} マイページのレイアウト。
 */
export default function MyPage(): React.JSX.Element {
  const { setProcessing } = useProcessing();
  const { data: session } = useSession(); // セッション情報を取得
  const router = useRouter();
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(session?.user?.name || "");
  const [autoApproval, setAutoApproval] = useState(false); // 自動承認フラグの状態

  /**
   * セッションデータが変更された際にアカウント名の入力値を更新。
   */
  useEffect(() => {
    if (session?.user?.name) {
      setInputValue(session.user.name);
    }
  }, [session?.user?.name]);

  /**
   * 初期データ（診断結果、自動承認フラグなど）をAPIから取得。
   */
  useEffect(() => {
    if (hasFetched) return;

    const fetchInitialData = async () => {
      try {
        setProcessing(true);

        // 診断結果の取得
        const response = await fetch("/api/diagnosisResult", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(`エラーが発生しました: ${response.statusText}`);
        }

        const result = await response.json();

        // 診断データの処理
        if (result.initialLogin) {
          console.log("初回ログインまたは診断結果が存在しません。");
          setError("診断結果がありません。診断を開始してください。");
        } else {
          const transformedData = formatDiagnosisData(result);
          setDiagnosisData(transformedData);
        }

        // 自動承認フラグの取得
        const userResponse = await fetch("/api/users", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!userResponse.ok) {
          throw new Error("ユーザー情報の取得に失敗しました。");
        }

        const userData = await userResponse.json();
        setAutoApproval(userData.autoApproval); // フラグを設定
      } catch (err) {
        console.error("データの取得中にエラー:", err);
        setError("データを取得できませんでした。");
      } finally {
        setProcessing(false);
        setHasFetched(true);
      }
    };

    fetchInitialData();
  }, [router, setProcessing, hasFetched]);

  /**
   * 編集モードを有効にするハンドラー。
   */
  const handleEditClick = () => {
    setIsEditing(true);
  };

  /**
   * アカウント名を保存するハンドラー。
   *
   * @param {React.FocusEvent<HTMLInputElement>} e - 入力要素のフォーカスイベント。
   */
  const handleSave = async (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInputValue(e.target.value);
    setIsEditing(false);

    if (!inputValue.trim()) {
      console.error("入力値が空です。保存できません。");
      return;
    }

    try {
      setInputValue(e.target.value);
    } catch (error) {
      console.error("保存中にエラーが発生しました:", error);
    }
  };

  /**
   * トグルスイッチの変更を処理し、データベースを更新。
   *
   * @param {boolean} newState - トグルスイッチの新しい状態。
   */
  const handleToggleChange = async (newState: boolean) => {
    try {
      setProcessing(true);
      setAutoApproval(newState);

      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.user?.id, autoApproval: newState }),
      });

      if (!response.ok) {
        throw new Error("自動承認フラグの更新に失敗しました。");
      }

      console.log("自動承認フラグが正常に更新されました。");
    } catch (err) {
      console.error("トグルスイッチの更新中にエラー:", err);
      setAutoApproval(!newState);
    } finally {
      setProcessing(false);
    }
  };

  const displayedNotifications = notifications.slice(0, 4);

  return (
    <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* 診断結果カード */}
      <Card title="診断結果">
        {error ? (
          <div className="flex flex-col items-center justify-center">
            <p className="text-gray-600">{error}</p>
            <Link href="/diagnosis/start">
              <button className="px-4 py-2 mt-4 text-white rounded bg-81d8d0 hover:bg-81d8d0/90">診断を開始する</button>
            </Link>
          </div>
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
            <FlowbitToggleSwitch isChecked={autoApproval} onChange={handleToggleChange} />
          </div>
        </div>
      </Card>
    </div>
  );
}
