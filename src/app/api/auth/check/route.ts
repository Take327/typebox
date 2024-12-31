import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const token = request.headers.get('cookie')?.includes('token');
  
  // 仮の認証状態判定
  const isLoggedIn = !!token;

  return NextResponse.json({ isLoggedIn });
}
