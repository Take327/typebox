/**
 * @file app/api/groups/route.ts
 * @description グループ一覧取得・新規作成を扱うエンドポイント
 */

import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db"; // MSSQL接続モジュール
import sql from "mssql";

export async function GET(request: NextRequest) {
  /**
   * @description ユーザーが所属するグループ一覧を取得する
   */
  try {
    const userId = request.headers.get("x-user-id"); // ユーザーIDをリクエストヘッダーから取得 (実装による)

    if (!userId) {
      return NextResponse.json({ error: "ユーザーIDが必要です" }, { status: 400 });
    }

    const db = await getPool();
    const result = await db.request().input("user_id", sql.Int, userId).query(`
        SELECT G.*
        FROM Groups G
        JOIN GroupMembers GM ON G.id = GM.group_id
        WHERE GM.user_id = @user_id
        ORDER BY G.created_at DESC
      `);

    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error("ユーザーのグループ取得エラー:", error);
    return new NextResponse("サーバーエラー", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  /**
   * @description グループを新規作成する
   */
  try {
    const body = await request.json();
    const { name, description } = body;

    // バリデーション: nameは必須
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "グループ名は必須です" }, { status: 400 });
    }

    const db = await getPool();
    const result = await db
      .request()
      .input("name", sql.NVarChar, name)
      .input("description", sql.NVarChar, description || null).query(`
        INSERT INTO Groups (name, description)
        OUTPUT INSERTED.id, INSERTED.name, INSERTED.description, INSERTED.created_at
        VALUES (@name, @description)
      `);

    const createdGroup = result.recordset[0];
    return NextResponse.json(createdGroup, { status: 201 });
  } catch (error) {
    console.error("グループ作成エラー:", error);
    return new NextResponse("サーバーエラー", { status: 500 });
  }
}
