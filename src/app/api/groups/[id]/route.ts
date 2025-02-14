/**
 * @file app/api/groups/[groupId]/route.ts
 * @description グループ詳細取得、更新、削除を扱う
 */

import { getPool } from "@/lib/db"; // データベースのインポート (適宜修正)
import { NextRequest, NextResponse } from "next/server";
import { PoolClient } from "pg";

/**
 * @description グループ詳細を取得する
 */
export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const routeParams = context.params.id;
  console.log("routeParams", routeParams);
  let client: PoolClient | undefined;
  try {
    const id = Number(routeParams);
    if (isNaN(id)) {
      return new NextResponse("Invalid group ID", { status: 400 });
    }

    // PostgreSQL用のSELECT文
    const query = `SELECT id, name, description, created_at FROM groups WHERE id = $1`;
    const values = [id];

    // データ取得
    client = await getPool();
    const result = await client.query(query, values);
    const group = result.rows[0];

    if (!group) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(group);
  } catch (error) {
    console.error("GET /api/groups/[groupId] エラー:", error);
    return new NextResponse("サーバーエラー", { status: 500 });
  } finally {
    if (client) {
      client.release();
    }
  }
}

/**
 * @description グループ情報を更新する
 */
export async function PUT(request: NextRequest, { params }: { params: { groupId: string } }) {
  return new NextResponse("未実装", { status: 500 });
}

/**
 * @description グループを削除する
 */
export async function DELETE(request: NextRequest, { params }: { params: { groupId: string } }) {
  return new NextResponse("未実装", { status: 500 });
}
