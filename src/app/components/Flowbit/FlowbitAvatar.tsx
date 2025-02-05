"use client";
import { Avatar, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { BiEdit } from "react-icons/bi";
import { useProcessing } from "../../../context/ProcessingContext";

export default function FlowbitAvatar() {
  // 処理中の状態を管理（Backdrop表示用）
  const { setProcessing } = useProcessing();
  const { data: session, status } = useSession({ required: true });
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(session?.user?.name || "");

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" }); // ログアウト後にログイン画面へリダイレクト
  };

  useEffect(() => {
    if (session?.user?.name) {
      setInputValue(session.user.name);
    }
  }, [session]);

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

  return (
    <Dropdown label={<Avatar rounded />} arrowIcon={false} inline>
      <DropdownHeader>
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
      </DropdownHeader>
      <DropdownDivider />
      <DropdownItem onClick={handleLogout}>Sign out</DropdownItem>
    </Dropdown>
  );
}
