import { MBTIDiagnosisResult, MBTIScore } from "../types";
import Redis from "ioredis";
import { convertScoreToDiagnosisResult } from "../utils/mbti/mbtiUtils";
import { getLatestDiagnosisResult } from "./getLatestDiagnosisResult";

const redis = new Redis();

export async function getCachedLatestDiagnosisResult(userId: number): Promise<MBTIDiagnosisResult | null> {
  const cacheKey = `diagnosisResult:${userId}`;
  try {
    // キャッシュをチェック
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log(`[Redis] キャッシュヒット: ${cacheKey}`);
      return JSON.parse(cachedData);
    }

    console.log(`[Redis] キャッシュミス: ${cacheKey}`);

    // 最新の診断結果を取得
    const score: MBTIScore | null = await getLatestDiagnosisResult(userId);
    if (!score) {
      return null; // データが見つからない場合
    }

    // スコアを診断結果に変換
    const result = convertScoreToDiagnosisResult(score);

    // キャッシュに保存
    await redis.set(cacheKey, JSON.stringify(result), "EX", 600); // キャッシュの有効期限は10分
    console.log(`[Redis] キャッシュ更新: ${cacheKey}`);
    return result;
  } catch (error) {
    console.error("[Redis] キャッシュ処理中にエラーが発生しました:", error);
    return null; // エラーが発生した場合、nullを返して続行
  }
}
