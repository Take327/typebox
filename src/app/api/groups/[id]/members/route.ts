/**
 * @file route.ts
 * @description グループのメンバー一覧を取得するAPI（認可チェック付き）
 */

import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db"; // MSSQL 接続
import sql from "mssql";
import { convertScoreToDiagnosisResult } from "@/utils/mbti/mbtiUtils"; // MBTIタイプ変換

export async function GET(request: NextRequest, { params }: { params: { id?: string } }) {
  if (!params || !params.id) {
    return NextResponse.json({ error: "グループIDが指定されていません" }, { status: 400 });
  }

  const groupId = parseInt(params.id, 10);
  if (isNaN(groupId) || groupId <= 0) {
    return NextResponse.json({ error: "無効なグループIDです" }, { status: 400 });
  }

  // ユーザー認証チェック
  const userId = request.headers.get("x-user-id");
  if (!userId || isNaN(Number(userId))) {
    return NextResponse.json({ error: "認証情報が不足しています" }, { status: 401 });
  }

  try {
    const db = await getPool();

    // **認可チェック**: ユーザーがこのグループに所属しているか確認
    const authCheck = await db
      .request()
      .input("group_id", sql.Int, groupId)
      .input("user_id", sql.Int, Number(userId))
      .query(`
        SELECT COUNT(*) AS count
        FROM GroupMembers
        WHERE group_id = @group_id AND user_id = @user_id
      `);

    if (authCheck.recordset[0].count === 0) {
      return NextResponse.json({ error: "このグループにアクセスする権限がありません" }, { status: 403 });
    }

    // **メンバー情報を取得 (診断結果含む)**
    const result = await db
      .request()
      .input("group_id", sql.Int, groupId)
      .query(`
        SELECT 
          gm.id, 
          gm.group_id, 
          gm.user_id, 
          u.name AS user_name, 
          d.type_E, d.type_I, d.type_S, d.type_N, 
          d.type_T, d.type_F, d.type_J, d.type_P, 
          gm.joined_at
        FROM GroupMembers gm
        JOIN Users u ON gm.user_id = u.id
        LEFT JOIN DiagnosisResults d ON gm.user_id = d.user_id
        WHERE gm.group_id = @group_id
        ORDER BY gm.joined_at ASC
      `);

    // **MBTIタイプを計算**
    const membersWithMBTI = result.recordset.map((member) => {
      const score = {
        E: member.type_E || 0,
        I: member.type_I || 0,
        S: member.type_S || 0,
        N: member.type_N || 0,
        T: member.type_T || 0,
        F: member.type_F || 0,
        J: member.type_J || 0,
        P: member.type_P || 0,
      };

      return {
        id: member.id,
        group_id: member.group_id,
        user_id: member.user_id,
        user_name: member.user_name,
        mbti_type: convertScoreToDiagnosisResult(score).type, // MBTIタイプを計算
        joined_at: member.joined_at,
      };
    });

    return NextResponse.json(membersWithMBTI);
  } catch (error) {
    console.error("メンバー一覧取得エラー:", error);
    return NextResponse.json({ error: "サーバー内部エラー" }, { status: 500 });
  }
}
