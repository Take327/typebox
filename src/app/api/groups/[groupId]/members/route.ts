/**
 * @file app/api/groups/[groupId]/members/route.ts
 * @description グループメンバーの招待・追加を扱う
 */

import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { Users } from "@/db/models"; // 既存のUsersテーブル参照

export async function GET(request: NextRequest, { params }: { params: { groupId: string } }) {
  /**
   * @description グループメンバー一覧を取得する
   */
  try {
    const groupId = Number(params.groupId);
    // const members = await db.groupMembers.findAll({ where: { group_id: groupId } });
    const members = [{ group_id: groupId, user_id: 1, joined_at: "2025-01-02T00:00:00" }];
    return NextResponse.json(members);
  } catch (error) {
    return new NextResponse("サーバーエラー", { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { groupId: string } }) {
  /**
   * @description グループにユーザーを追加（招待）する
   * auto_approval が ON の場合は即参加、OFF の場合は仮ステータスや通知を出す
   */
  try {
    const groupId = Number(params.groupId);
    const { userId } = await request.json();

    // const user = await db.users.findOne({ where: { id: userId } });
    // if (!user) return new NextResponse("User Not Found", { status: 404 });

    // if (user.auto_approval === true) {
    //   // すぐに groupMembers テーブルに登録
    //   await db.groupMembers.create({ group_id: groupId, user_id: userId });
    // } else {
    //   // 通知レコードなどを作成し、ユーザーが承認したら groupMembers へ登録
    // }

    return NextResponse.json({
      message: "招待処理を受け付けました。（自動承認がONであれば即参加）",
    });
  } catch (error) {
    return new NextResponse("サーバーエラー", { status: 500 });
  }
}
