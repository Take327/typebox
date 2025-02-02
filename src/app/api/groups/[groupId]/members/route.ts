import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;
  const groupIdNumber = Number(groupId);
  return NextResponse.json({ groupId: groupIdNumber });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
  try {
    const { groupId } = await params;
    const { userId } = await request.json();

    return NextResponse.json({
      message: "招待処理を受け付けました。（自動承認がONであれば即参加）",
      groupId,
      userId,
    });
  } catch (error) {
    return new NextResponse("サーバーエラー", { status: 500 });
  }
}
