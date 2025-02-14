import { getPool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { PoolClient } from "pg";

export async function GET(request: NextRequest, context: any) {
  // 必要に応じてアサーション
  const { id } = context.params as { id: string };
  console.log("routeParam", id);

  let client: PoolClient | undefined;
  try {
    const groupId = Number(id);
    if (isNaN(groupId)) {
      return new NextResponse("Invalid group ID", { status: 400 });
    }

    const query = `SELECT id, name, description, created_at FROM groups WHERE id = $1`;
    const values = [groupId];

    client = await getPool();
    const result = await client.query(query, values);
    const group = result.rows[0];

    if (!group) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(group);
  } catch (error) {
    console.error("GET /api/groups/[id] エラー:", error);
    return new NextResponse("サーバーエラー", { status: 500 });
  } finally {
    if (client) {
      client.release();
    }
  }
}
