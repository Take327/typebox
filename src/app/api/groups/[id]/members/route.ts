import { convertScoreToDiagnosisResult } from "@/utils/mbti/mbtiUtils"; // MBTIタイプ変換
import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

// データベース接続プールの作成
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // 環境変数から接続情報を取得
  // 他の接続オプションが必要な場合はここに追加
});

export async function GET(request: NextRequest, context: any) {
  // params は非同期かもしれないので await
  const routeParams = await context.params;

  // routeParams.id を実行時にバリデーション
  if (!routeParams?.id) {
    return NextResponse.json({ error: "グループIDが指定されていません" }, { status: 400 });
  }

  const groupId = parseInt(routeParams.id, 10);
  if (isNaN(groupId) || groupId <= 0) {
    return NextResponse.json({ error: "無効なグループIDです" }, { status: 400 });
  }

  // ユーザー認証チェック
  const userId = request.headers.get("x-user-id");
  if (!userId || isNaN(Number(userId))) {
    return NextResponse.json({ error: "認証情報が不足しています" }, { status: 401 });
  }

  try {
    // **認可チェック**: ユーザーがこのグループに所属しているか確認
    const authCheckQuery = `
      SELECT COUNT(*) AS count
      FROM GroupMembers
      WHERE group_id = $1 AND user_id = $2
    `;
    const authCheckValues = [groupId, Number(userId)];
    const authCheckResult = await pool.query(authCheckQuery, authCheckValues);

    if (authCheckResult.rows[0].count === 0) {
      return NextResponse.json({ error: "このグループにアクセスする権限がありません" }, { status: 403 });
    }

    // **メンバー情報を取得 (診断結果含む)**
    const membersQuery = `
      SELECT
          gm.id,
          gm.group_id,
          gm.user_id,
          u.name AS user_name,
          d.type_e,
          d.type_i,
          d.type_s,
          d.type_n,
          d.type_t,
          d.type_f,
          d.type_j,
          d.type_p,
          gm.joined_at
      FROM GroupMembers gm
      JOIN Users u ON gm.user_id = u.id
      LEFT JOIN (
          SELECT DISTINCT ON (user_id) *
          FROM DiagnosisResults
          WHERE user_id IN (
              SELECT user_id
              FROM GroupMembers
              WHERE group_id = $1
          )
          ORDER BY user_id, created_at DESC
      ) d ON gm.user_id = d.user_id
      WHERE gm.group_id = $1
      ORDER BY gm.joined_at ASC;
    `;
    const membersValues = [groupId];
    const membersResult = await pool.query(membersQuery, membersValues);

    // **MBTIタイプを計算**
    const membersWithMBTI = membersResult.rows.map((member) => {
      const score = {
        E: member.type_e || 0,
        I: member.type_i || 0,
        S: member.type_s || 0,
        N: member.type_n || 0,
        T: member.type_t || 0,
        F: member.type_f || 0,
        J: member.type_j || 0,
        P: member.type_p || 0,
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
