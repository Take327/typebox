import { useEffect, useState } from "react";
import { GroupData } from "@/types";

/**
 * @description ユーザーの所属グループを取得するカスタムフック
 */
export function useGroups(userId: number | null) {
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchGroups() {
    try {
      if (!userId) return;

      const res = await fetch("/api/groups", {
        method: "GET",
        headers: { "x-user-id": userId.toString() },
      });

      if (!res.ok) throw new Error("グループ一覧の取得に失敗しました");

      const data = await res.json();
      setGroups(data);
    } catch (err: any) {
      console.error("グループ一覧取得エラー:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (userId) {
      fetchGroups();
    }
  }, [userId]);

  return { groups, isLoading, error };
}
