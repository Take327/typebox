"use client";
import { Avatar, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { BiEdit } from "react-icons/bi";
import { useProcessing } from "../../../context/ProcessingContext";
import { LuLogOut } from "react-icons/lu";

export default function FlowbitAvatar() {
  const { setProcessing } = useProcessing();
  const { data: session, status } = useSession({ required: true });
  const [isEditing, setIsEditing] = useState(false);

  // DBから取得したアカウント名を保持
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      if (!session?.user?.email) return;

      try {
        const email = encodeURIComponent(session.user.email);
        const response = await fetch(`/api/users?email=${email}`);

        if (!response.ok) throw new Error("ユーザー情報の取得に失敗しました");

        const data = await response.json();
        setInputValue(data.name || "未設定");
      } catch (error) {
        console.error("ユーザー情報の取得エラー:", error);
      }
    };

    fetchUserName();
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

    if (!trimmedValue) {
      console.error("入力値が空です。保存できません。");
      setIsEditing(false);
      return;
    }

    setIsEditing(false);
    setInputValue(trimmedValue);

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

      if (!response.ok) throw new Error("アカウント名の更新に失敗しました");

      console.log("アカウント名を保存:", trimmedValue);
    } catch (error) {
      console.error("保存中にエラーが発生しました:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <Dropdown label={<Avatar rounded />} arrowIcon={false} inline>
      <DropdownHeader>
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
                  onChange={(e) => setInputValue(e.target.value)}
                  onBlur={handleSave}
                  autoFocus
                />
              ) : (
                <span className="ml-3">{inputValue || "未設定"}</span>
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
      <DropdownItem onClick={handleLogout} className="flex items-center space-x-2">
        <LuLogOut className="h-5 w-5" />
        <span>ログアウト</span>
      </DropdownItem>
    </Dropdown>
  );
}
