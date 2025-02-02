"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { Group } from "@/types";

/**
 * Contextで提供する値の型
 */
type GroupsContextValue = {
  groups: Group[];
  createGroup: (name: string, description: string) => void;
  updateGroup: (id: string, updated: { name: string; description: string }) => void;
  deleteGroup: (id: string) => void;
};

/**
 * グループ情報を保持するContext
 */
const GroupsContext = createContext<GroupsContextValue | undefined>(undefined);

/**
 * GroupsMockProviderのProps
 */
type GroupsMockProviderProps = {
  children: ReactNode;
};

/**
 * グループ情報を管理するContextプロバイダ
 * @param {GroupsMockProviderProps} props - コンポーネント子要素
 * @returns {JSX.Element} コンテキストプロバイダ
 */
export function GroupsMockProvider({ children }: GroupsMockProviderProps): JSX.Element {
  // 初期データ: モック用
  const [groups, setGroups] = useState<Group[]>([
    {
      id: (Date.now() + Math.floor(Math.random() * 10000)).toString(),
      name: "開発チーム",
      description: "フロントエンド・バックエンド・デザイン担当が所属するチームです。",
      created_at: new Date().toISOString(),
    },
    {
      id: (Date.now() + Math.floor(Math.random() * 10000)).toString(),
      name: "マーケティング",
      description: "広告運用やSNS運用を行うチームです。",
      created_at: new Date().toISOString(),
    },
  ]);

  /**
   * グループを新規作成する
   * @param {string} name - グループ名
   * @param {string} description - グループ説明
   */
  function createGroup(name: string, description: string): void {
    const newGroup: Group = {
      id: (Date.now() + Math.floor(Math.random() * 10000)).toString(),
      name,
      description,
      created_at: new Date().toISOString(),
    };
    setGroups((prev) => [...prev, newGroup]);
  }

  /**
   * グループ情報を更新する
   * @param {string} id - 更新対象のグループID
   * @param {{name: string, description: string}} updated - 更新内容
   */
  function updateGroup(id: string, updated: { name: string; description: string }): void {
    setGroups((prev) => prev.map((group) => (group.id === id ? { ...group, ...updated } : group)));
  }

  /**
   * グループを削除する
   * @param {string} id - 削除対象のグループID
   */
  function deleteGroup(id: string): void {
    setGroups((prev) => prev.filter((group) => group.id !== id));
  }

  return (
    <GroupsContext.Provider value={{ groups, createGroup, updateGroup, deleteGroup }}>
      {children}
    </GroupsContext.Provider>
  );
}

/**
 * グループ情報を利用するためのカスタムフック
 * @returns {GroupsContextValue} グループ情報とCRUDロジック
 */
export function useGroups(): GroupsContextValue {
  const context = useContext(GroupsContext);
  if (!context) {
    throw new Error("useGroups must be used within GroupsMockProvider");
  }
  return context;
}
