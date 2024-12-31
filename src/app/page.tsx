"client use"
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/options"; // 正しいパスを指定
import { redirect } from "next/navigation";

export default async function MyPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1>マイページ</h1>
      <p>ここにユーザー固有の情報を表示します。</p>
    </div>
  );
}
