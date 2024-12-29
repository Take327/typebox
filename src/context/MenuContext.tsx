"use client"; // クライアントサイドで動作するコンポーネントであることを指定

import React, { createContext, useContext, useState } from "react";

// メニューの状態と操作を管理するための型定義
type MenuContextType = {
  isOpen: boolean; // メニューが開いているかを示すフラグ
  toggleMenu: () => void; // メニューの開閉を切り替える関数
};

// コンテキストを作成し、初期値は未定義
const MenuContext = createContext<MenuContextType | undefined>(undefined);

// コンテキストプロバイダーを定義
export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false); // メニューの開閉状態を管理

  // メニューの開閉状態を切り替える関数
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    // コンテキストプロバイダーで子コンポーネントをラップし、値を提供
    <MenuContext.Provider value={{ isOpen, toggleMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

// コンテキストの値を取得するためのカスタムフック
export const useMenu = () => {
  // コンテキストの値を取得
  const context = useContext(MenuContext);

  // コンテキストが未定義の場合はエラーをスロー
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }

  // コンテキストの値を返す
  return context;
};
