/**
 * @file app/api/groups/route.ts
 * @description グループ一覧取得・新規作成を扱うエンドポイント
 */

import { NextRequest, NextResponse } from "next/server";
// import db from "@/lib/db"; // DB接続用のモジュール(擬似)

export async function GET(request: NextRequest) {
  /**
   * @description グループ一覧を取得する
   */
  try {
    // const groups = await db.groups.findAll();
    const groups = [
      // モックデータとして返す例
      { id: 1, name: "開発チーム", description: "フロント/バック合同", created_at: "2025-01-01T00:00:00" },
      { id: 2, name: "マーケティング", description: "SNS運用チーム", created_at: "2025-02-01T00:00:00" },
    ];
    return NextResponse.json(groups);
  } catch (error) {
    return new NextResponse("サーバーエラー", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  /**
   * @description グループを新規作成する
   */
  try {
    const body = await request.json();
    // const createdGroup = await db.groups.create({
    //   name: body.name,
    //   description: body.description || null
    // });
    const createdGroup = {
      id: 3,
      name: body.name,
      description: body.description,
      created_at: new Date().toISOString(),
    };
    return NextResponse.json(createdGroup, { status: 201 });
  } catch (error) {
    return new NextResponse("サーバーエラー", { status: 500 });
  }
}
