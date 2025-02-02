import { NextRequest, NextResponse } from "next/server";
import { getPool } from "../../../lib/db";
import { getUserInfoByEmail } from "../../../lib/getUserInfo";

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
 * ユーザーの情報を更新するAPIエンドポイント (POST /api/users)
 *
 * リクエストボディ例:
 * {
 *   "userId": 123,
 *   "autoApproval": true,
 *   "newName": "JohnDoe"
 * }
 *
 * @param {NextRequest} req - HTTPリクエストオブジェクト（POSTリクエスト）
 * @returns {Promise<NextResponse>} - 更新結果を示すJSONレスポンス
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // リクエストボディをJSONとして取得
    const { userId, autoApproval, newName } = await req.json();

    // 入力チェック
    // userId は必須かつ数値
    if (typeof userId !== "number") {
      return NextResponse.json(
        {
          error: '入力が無効です。"userId" は数値である必要があります。',
        },
        { status: 400 }
      );
    }

    // autoApproval が指定されている場合は boolean であることをチェック（undefined なら無視）
    if (autoApproval !== undefined && typeof autoApproval !== "boolean") {
      return NextResponse.json(
        {
          error: '入力が無効です。"autoApproval" は真偽値である必要があります。',
        },
        { status: 400 }
      );
    }

    // newName が指定されている場合は string であることをチェック（undefined なら無視）
    if (newName !== undefined && typeof newName !== "string") {
      return NextResponse.json(
        {
          error: '入力が無効です。"newName" は文字列である必要があります。',
        },
        { status: 400 }
      );
    }

    // 更新用のクエリを動的に組み立てる
    // 例: UPDATE Users SET auto_approval = @autoApproval, name = @newName WHERE id = @userId
    const updates: string[] = [];
    if (autoApproval !== undefined) {
      updates.push("auto_approval = @autoApproval");
    }
    if (newName !== undefined) {
      updates.push("name = @newName");
    }

    // 更新すべきフィールドが何も無い場合は終了
    if (updates.length === 0) {
      return NextResponse.json(
        {
          message: "更新対象の項目がありません。",
        },
        { status: 200 }
      );
    }

    const updateClause = updates.join(", ");
    const sql = `UPDATE Users SET ${updateClause} WHERE id = @userId`;

    // データベース接続プールを取得
    const pool = await getPool();
    const request = pool.request().input("userId", userId);

    if (autoApproval !== undefined) {
      request.input("autoApproval", autoApproval ? 1 : 0);
    }
    if (newName !== undefined) {
      request.input("newName", newName);
    }

    // SQLクエリを実行
    const result = await request.query(sql);

    // 更新が行われなかった場合（該当ユーザーがいない、または変更が無かった）
    if (result.rowsAffected[0] === 0) {
      return NextResponse.json(
        { error: "該当するユーザーが見つからないか、変更がありませんでした。" },
        { status: 404 }
      );
    }

    // 更新成功時のレスポンスを返す
    return NextResponse.json({ message: "ユーザー情報が正常に更新されました。" }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/users] エラー:", error);

    // 予期しないエラー発生時に 500 Internal Server Error を返す
    return NextResponse.json({ error: "内部サーバーエラーが発生しました。" }, { status: 500 });
  }
}
