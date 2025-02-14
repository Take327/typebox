import { getUserInfoByEmail } from "@/lib/getUserInfo";
import { NextRequest, NextResponse } from "next/server";

/**
 * ユーザー情報を取得するAPIエンドポイント (GET /api/users?email=...)
 *
 * @param {NextRequest} req - HTTPリクエストオブジェクト（GETリクエスト）
 * @returns {Promise<NextResponse>} - ユーザー情報を含むJSONレスポンス
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // リクエストボディをJSONとして取得
    const body = await req.json();
    const email = body.email;

    // `email` が提供されていない場合は 400 Bad Request を返す
    if (!email) {
      return NextResponse.json({ error: "メールアドレスが指定されていません。" }, { status: 400 });
    }

    // メールアドレスをキーにデータベースからユーザー情報を取得
    const userInfo = await getUserInfoByEmail(email);

    // ユーザー情報をJSONレスポンスとして返す
    return NextResponse.json(userInfo, { status: 200 });
  } catch (error) {
    console.error("[POST /api/users] エラー:", error);

    // 予期しないエラー発生時に 500 Internal Server Error を返す
    return NextResponse.json({ error: "内部サーバーエラーが発生しました。" }, { status: 500 });
  }
}
