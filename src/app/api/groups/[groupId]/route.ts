/**
 * @file app/api/groups/[groupId]/route.ts
 * @description グループ詳細取得、更新、削除を扱う
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { groupId: string } }) {
  /**
   * @description グループ詳細を取得する
   */
  try {
    const id = Number(params.groupId);
    // const group = await db.groups.findOne({ where: { id } });
    const group = {
      id,
      name: "開発チーム",
      description: "仮の説明文",
      created_at: new Date().toISOString(),
    };
    if (!group) {
      return new NextResponse("Not Found", { status: 404 });
    }
    return NextResponse.json(group);
  } catch (error) {
    return new NextResponse("サーバーエラー", { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { groupId: string } }) {
  /**
   * @description グループ情報を更新する
   */
  try {
    const id = Number(params.groupId);
    const body = await request.json();
    // const updatedGroup = await db.groups.update({ ... }, { where: { id } });
    const updatedGroup = {
      id,
      name: body.name,
      description: body.description,
      created_at: "2025-01-01T00:00:00",
    };
    return NextResponse.json(updatedGroup);
  } catch (error) {
    return new NextResponse("サーバーエラー", { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { groupId: string } }) {
  /**
   * @description グループを削除する
   */
  try {
    const id = Number(params.groupId);
    // await db.groups.delete({ where: { id } });
    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    return new NextResponse("サーバーエラー", { status: 500 });
  }
}
