import { NextRequest, NextResponse } from "next/server";
import { getPool } from "../../..//lib/db";
import { getUserInfoByEmail } from "../../..//lib/getUserInfo";

/**
 * ユーザー情報を取得するAPIエンドポイント
 */
export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "メールアドレスが指定されていません。" }, { status: 400 });
    }

    const userInfo = await getUserInfoByEmail(email);
    return NextResponse.json(userInfo, { status: 200 });
  } catch (error) {
    console.error("[GET /api/users] エラー:", error);
    return NextResponse.json({ error: "内部サーバーエラーが発生しました。" }, { status: 500 });
  }
}

/**
 * ユーザーの `auto_approval` フラグを更新するAPIエンドポイント
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, autoApproval } = await req.json();

    if (typeof userId !== "number" || typeof autoApproval !== "boolean") {
      return NextResponse.json(
        { error: '入力が無効です。"userId" は数値、"autoApproval" は真偽値である必要があります。' },
        { status: 400 }
      );
    }

    const pool = await getPool();
    const result = await pool
      .request()
      .input("userId", userId)
      .input("autoApproval", autoApproval ? 1 : 0)
      .query("UPDATE Users SET auto_approval = @autoApproval WHERE id = @userId");

    if (result.rowsAffected[0] === 0) {
      return NextResponse.json(
        { error: "該当するユーザーが見つからないか、更新が行われませんでした。" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "auto_approval フラグが正常に更新されました。" }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/users] エラー:", error);
    return NextResponse.json({ error: "内部サーバーエラーが発生しました。" }, { status: 500 });
  }
}
