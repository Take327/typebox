"use client";
import React, { useEffect, useState } from "react";
import { TextInput } from "flowbite-react";
import { BiEdit } from "react-icons/bi";
import FlowbitToggleSwitch from "../../components/Flowbit/FlowbitToggleSwitch";
import Card from "../../components/Card";
import { notifications } from "../../../mock";
import { Session } from "next-auth";

interface SettingsCardProps {
  session: Session | null; // NextAuthのSession型など適切な型に差し替えてください
  setProcessing: (processing: boolean) => void;
}

export default function SettingsCard({ session, setProcessing }: SettingsCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(session?.user?.name || "");
  const [autoApproval, setAutoApproval] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const displayedNotifications = notifications.slice(0, 4);

  /**
   * 初期データ（自動承認フラグなど）を取得する非同期関数
   */
  const fetchInitialSettings = async () => {
    try {
      setProcessing(true);

      const userResponse = await fetch(`/api/users?email=${session?.user?.email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!userResponse.ok) {
        throw new Error("ユーザー情報の取得に失敗しました。");
      }

      const userData = await userResponse.json();
      if (!userData) {
        throw new Error("ユーザー情報のがありませんでした。");
      }

      setAutoApproval(userData.autoApproval);
    } catch (err) {
      console.error("データの取得中にエラー:", err);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (!hasFetched) {
      fetchInitialSettings();
      setHasFetched(true);
    }
  }, [hasFetched]);

  /**
   * アカウント名を編集する
   */
  const handleEditClick = () => {
    setIsEditing(true);
  };

  /**
   * アカウント名を保存する（フォーカスを外したタイミングで発火）
   */
  const handleSave = async (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    const trimmedValue = e.target.value.trim();

    // 空文字の場合は保存しない
    if (!trimmedValue) {
      console.error("入力値が空です。保存できません。");
      setIsEditing(false);
      return;
    }

    setIsEditing(false);
    setInputValue(trimmedValue);

    // 保存処理（API呼び出しなど）を実装
    try {
      // ここでAPIに送るなど
      console.log("アカウント名を保存:", trimmedValue);
    } catch (error) {
      console.error("保存中にエラーが発生しました:", error);
    }
  };

  /**
   * トグルスイッチの変更を処理し、データベースを更新
   */
  const handleToggleChange = async (newState: boolean) => {
    try {
      setProcessing(true);
      setAutoApproval(newState);

      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id,
          autoApproval: newState,
        }),
      });

      if (!response.ok) {
        throw new Error("自動承認フラグの更新に失敗しました。");
      }

      console.log("自動承認フラグが正常に更新されました。");
    } catch (err) {
      console.error("トグルスイッチの更新中にエラー:", err);
      // 失敗時は元の状態に戻す
      setAutoApproval(!newState);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card title="通知と設定">
      {/* 未処理通知 */}
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

      {/* アカウント情報 */}
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

      {/* 自動承認トグル */}
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
  );
}
