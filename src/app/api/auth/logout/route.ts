import { NextResponse } from 'next/server';

/**
 * ユーザーのセッションを削除し、ログアウトを実行するAPIエンドポイント
 * 
 * @returns {Promise<NextResponse>} セッション削除成功のレスポンス
 */
export async function POST(): Promise<NextResponse> {
  // セッション削除後に返すレスポンスを作成
  // メッセージはクライアントに成功を通知するためのもの
  const response = NextResponse.json({ message: 'Logged out successfully' });

  // クッキーの「token」を削除してセッションを無効化
  // maxAge: 0に設定することでクッキーが即時無効になる
  response.cookies.set('token', '', { maxAge: 0, path: '/' });

  // 最終的にレスポンスを返す
  return response;
}
