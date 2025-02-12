import { NextRequest, NextResponse } from "next/server";
import { getPool } from "../../../lib/db";
import { getUserInfoByEmail } from "@/lib/getUserInfo";

/**
 * ユーザー情報を取得するAPIエンドポイント (GET /api/users?email=...)
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
 * ユーザー情報を更新するAPIエンドポイント (POST /api/users)
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { userId, autoApproval, newName } = await req.json();

    // 入力チェック
    if (typeof userId !== "number") {
      return NextResponse.json({ error: '入力が無効です。"userId" は数値である必要があります。' }, { status: 400 });
    }
    if (autoApproval !== undefined && typeof autoApproval !== "boolean") {
      return NextResponse.json(
        { error: '入力が無効です。"autoApproval" は真偽値である必要があります。' },
        { status: 400 }
      );
    }
    if (newName !== undefined && typeof newName !== "string") {
      return NextResponse.json({ error: '入力が無効です。"newName" は文字列である必要があります。' }, { status: 400 });
    }

    const updates: string[] = [];
    const values: any[] = [userId]; // プレースホルダー用の配列
    let index = 2; // プレースホルダーのカウント用

    if (autoApproval !== undefined) {
      updates.push(`auto_approval = $${index}`);
      values.push(autoApproval);
      index++;
    }
    if (newName !== undefined) {
      updates.push(`name = $${index}`);
      values.push(newName);
      index++;
    }

    if (updates.length === 0) {
      return NextResponse.json({ message: "更新対象の項目がありません。" }, { status: 200 });
    }

    const updateClause = updates.join(", ");
    const sql = `UPDATE Users SET ${updateClause} WHERE id = $1 RETURNING *`;

    // データベース接続プールを取得
    const pool = await getPool();
    const result = await pool.query(sql, values);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "該当するユーザーが見つからないか、変更がありませんでした。" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "ユーザー情報が正常に更新されました。" }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/users] エラー:", error);
    return NextResponse.json({ error: "内部サーバーエラーが発生しました。" }, { status: 500 });
  }
}
