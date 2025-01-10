import { NextRequest, NextResponse } from "next/server";
import { getServerSessionUserId } from "../../../../lib/getServerSessionUserId";

/**
 * APIハンドラー: ユーザー認証状態をチェックするためのGETエンドポイント
 * 
 * @async
 * @function GET
 * @param {NextRequest} req - APIリクエストオブジェクト。リクエストヘッダーやクエリパラメータを含む。
 * @returns {Promise<NextResponse>} レスポンスオブジェクト。
 * - 成功時: ステータスコード200と認証されたユーザーIDを返す。
 * - 認証エラー時: ステータスコード401とエラーメッセージを返す。
 * - サーバーエラー時: ステータスコード500とエラーメッセージを返す。
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // ユーザーIDをセッションから取得する処理
    const userId = await getServerSessionUserId(req);

    // ユーザーIDが取得できない場合、認証エラーを返す
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 認証成功時、ユーザーIDを含むレスポンスを返す
    return NextResponse.json({ userId }, { status: 200 });
  } catch (error) {
    // エラーログをコンソールに出力
    console.error("[GET /api/auth/check] エラー:", error);

    // サーバーエラーのレスポンスを返す
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
