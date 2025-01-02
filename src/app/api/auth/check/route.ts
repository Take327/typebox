import { NextResponse } from "next/server";

/**
 * GETリクエストを処理するAPI関数。
 *
 * この関数は、受信したリクエストヘッダーに含まれるCookie情報を使用して、
 * ユーザーがログインしているかどうかを判定します。
 * 判定結果はJSON形式のレスポンスとしてクライアントに返却されます。
 *
 * @param {Request} request - HTTPリクエストオブジェクト。リクエストヘッダーやメソッド情報を含む。
 * @returns {Promise<NextResponse>} - クライアントに返却するレスポンスオブジェクト。
 */
export async function GET(request: Request) {
  // Cookieヘッダーから'token'という文字列が含まれているかを確認
  // ※Cookieが未設定の場合はundefinedになる可能性あり
  const token = request.headers.get("cookie")?.includes("token");

  // 仮の認証状態を判定（トークンが存在する場合にログイン状態と見なす）
  const isLoggedIn = !!token;

  // 認証状態をJSON形式でレスポンスとして返却
  return NextResponse.json({ isLoggedIn });
}
