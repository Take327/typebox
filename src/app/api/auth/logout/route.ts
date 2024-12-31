import { NextResponse } from 'next/server';

export async function POST() {
  // 仮のセッション削除処理
  const response = NextResponse.json({ message: 'Logged out successfully' });
  
  // クッキーを削除
  response.cookies.set('token', '', { maxAge: 0, path: '/' });

  return response;
}
