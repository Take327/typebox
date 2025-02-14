import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
        console.warn("session.user.email が取得できません");
        router.push("/login");
        return;
      }

      const res = await fetch(`/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session.user.email }),
      });

      if (!res.ok) throw new Error("ユーザー情報の取得に失敗しました");

      const data = await res.json();
      setUserData(data);
    } catch (err) {
      console.error("ユーザー情報取得エラー:", err);
    }
  }

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetchUserData();
    }
  }, [status, session]);

  return userData || {}; // null の代わりに空オブジェクトを返す
}
