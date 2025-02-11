/**
 * @file app/api/groups/route.ts
 * @description グループ一覧取得・新規作成を扱うエンドポイント
 */

import { getPool } from "@/lib/db"; // PostgreSQL 接続モジュール
import { NextRequest, NextResponse } from "next/server";

/**
 * ユーザーが所属するグループ一覧を取得する
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id"); // ユーザーIDをリクエストヘッダーから取得

    if (!userId) {
      return NextResponse.json({ error: "ユーザーIDが必要です" }, { status: 400 });
    }

    const db = await getPool();
    const query = `
      SELECT G.*
      FROM Groups G
      JOIN GroupMembers GM ON G.id = GM.group_id
      WHERE GM.user_id = $1
      ORDER BY G.created_at DESC
    `;
    const values = [userId];

    const result = await db.query(query, values);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("ユーザーのグループ取得エラー:", error);
    return new NextResponse("サーバーエラー", { status: 500 });
  }
}

/**
 * グループを新規作成する
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    // バリデーション: nameは必須
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "グループ名は必須です" }, { status: 400 });
    }

    const db = await getPool();
    const query = `
      INSERT INTO Groups (name, description)
      VALUES ($1, $2)
      RETURNING id, name, description, created_at
    `;
    const values = [name, description || null];

    const result = await db.query(query, values);
    const createdGroup = result.rows[0];

    return NextResponse.json(createdGroup, { status: 201 });
  } catch (error) {
    console.error("グループ作成エラー:", error);
    return new NextResponse("サーバーエラー", { status: 500 });
  }
}
