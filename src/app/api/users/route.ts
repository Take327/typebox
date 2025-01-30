import { NextRequest, NextResponse } from "next/server";
import { getPool } from "../../../lib/db";
import { getUserInfoByEmail } from "../../../lib/getUserInfo";

/**
 * ユーザー情報を取得するAPIエンドポイント
 *
 * @param {NextRequest} req - HTTPリクエストオブジェクト（GETリクエスト）
 * @returns {Promise<NextResponse>} - ユーザー情報を含むJSONレスポンス
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // クエリパラメータから `email` を取得
    const email = req.nextUrl.searchParams.get("email");

    // `email` パラメータがない場合は 400 Bad Request を返す
    if (!email) {
      return NextResponse.json({ error: "メールアドレスが指定されていません。" }, { status: 400 });
    }

    // メールアドレスをキーにデータベースからユーザー情報を取得
    const userInfo = await getUserInfoByEmail(email);

    // ユーザー情報をJSONレスポンスとして返す
    return NextResponse.json(userInfo, { status: 200 });
  } catch (error) {
    console.error("[GET /api/users] エラー:", error);

    // 予期しないエラー発生時に 500 Internal Server Error を返す
    return NextResponse.json({ error: "内部サーバーエラーが発生しました。" }, { status: 500 });
  }
}

/**
 * ユーザーの `auto_approval` フラグを更新するAPIエンドポイント
 *
 * @param {NextRequest} req - HTTPリクエストオブジェクト（POSTリクエスト）
 * @returns {Promise<NextResponse>} - 更新結果を示すJSONレスポンス
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // リクエストボディをJSONとして取得
    const { userId, autoApproval } = await req.json();

    // `userId` は数値、`autoApproval` は真偽値であることを確認
    if (typeof userId !== "number" || typeof autoApproval !== "boolean") {
      return NextResponse.json(
        {
          error: '入力が無効です。"userId" は数値、"autoApproval" は真偽値である必要があります。',
        },
        { status: 400 }
      );
    }

    // データベース接続プールを取得
    const pool = await getPool();

    // `auto_approval` の値を更新するSQLクエリを実行
    const result = await pool
      .request()
      .input("userId", userId) // ユーザーID
      .input("autoApproval", autoApproval ? 1 : 0) // 真偽値を整数（1 or 0）に変換
      .query("UPDATE Users SET auto_approval = @autoApproval WHERE id = @userId");

    // 更新が行われなかった場合（該当ユーザーがいない、または変更がなかった）
    if (result.rowsAffected[0] === 0) {
      return NextResponse.json(
        { error: "該当するユーザーが見つからないか、更新が行われませんでした。" },
        { status: 404 }
      );
    }

    // 更新成功時のレスポンスを返す
    return NextResponse.json({ message: "auto_approval フラグが正常に更新されました。" }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/users] エラー:", error);

    // 予期しないエラー発生時に 500 Internal Server Error を返す
    return NextResponse.json({ error: "内部サーバーエラーが発生しました。" }, { status: 500 });
  }
}
