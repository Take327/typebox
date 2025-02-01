"use client";
import React, { useEffect, useState } from "react";
import { TextInput } from "flowbite-react";
import { BiEdit } from "react-icons/bi";
import FlowbitToggleSwitch from "../../components/Flowbit/FlowbitToggleSwitch";
import Card from "../../components/Card";
import { notifications } from "../../../mock";
import { Session } from "next-auth";

interface SettingsCardProps {
  /**
   * ユーザーのセッション情報
   */
  session: Session | null; // NextAuthのSession型など適切な型に合わせてください
  /**
   * 処理中フラグをセットする関数
   */
  setProcessing: (processing: boolean) => void;
}

/**
 * 設定カードコンポーネント
 * @param session ユーザーのセッション情報
 * @param setProcessing 処理中フラグをセットする関数
 */
export default function SettingsCard({ session, setProcessing }: SettingsCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(session?.user?.name || "");
  const displayedNotifications = notifications.slice(0, 4);
  const [autoApproval, setAutoApproval] = useState(session?.user?.autoApproval || false);

  /**
   * アカウント名編集モードに入る
   */
  const handleEditClick = () => {
    setIsEditing(true);
  };

  /**
   * アカウント名を保存する（フォーカスを外したタイミングで発火）
   * @param e フォーカスイベント
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
      setProcessing(true);

      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id,
          newName: trimmedValue,
        }),
      });

      if (!response.ok) {
        throw new Error("アカウント名の更新に失敗しました。");
      }

      console.log("アカウント名を保存:", trimmedValue);
      // ここで必要に応じてステートやコンテキストを更新する
    } catch (error) {
      console.error("保存中にエラーが発生しました:", error);
      // エラー時に表示するUIが必要な場合はここで実装
    } finally {
      setProcessing(false);
    }
  };

  /**
   * トグルスイッチの変更を処理し、データベースを更新
   * @param newState 新しいトグル状態
   */
  const handleToggleChange = async (newState: boolean) => {
    try {
      setProcessing(true);

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
      setAutoApproval(newState);
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
