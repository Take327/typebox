import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * @description ユーザー情報を取得するカスタムフック
 */
export function useUserData() {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();
  const [userData, setUserData] = useState<any | null>(null);

  async function fetchUserData() {
    try {
      if (!session?.user?.email) {
        router.push("/login");
        return;
      }
      const res = await fetch(`/api/users?email=${session.user.email}`, { method: "GET" });
      if (!res.ok) throw new Error("ユーザー情報の取得に失敗しました");
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      console.error("ユーザー情報取得エラー:", err);
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserData();
    }
  }, [status]);

  return userData;
}
