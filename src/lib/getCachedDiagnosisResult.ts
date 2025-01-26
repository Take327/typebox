import { MBTIDiagnosisResult, MBTIScore } from "../types";
import { convertScoreToDiagnosisResult } from "../utils/mbti/mbtiUtils";
import { getLatestDiagnosisResult } from "./getLatestDiagnosisResult";

// メモリキャッシュを使用
const memoryCache = new Map<string, { data: MBTIDiagnosisResult; expiry: number }>();

export async function getCachedLatestDiagnosisResult(userId: number): Promise<MBTIDiagnosisResult | null> {
  const cacheKey = `diagnosisResult:${userId}`;
  const now = Date.now();

  try {
    // キャッシュをチェック
    const cachedEntry = memoryCache.get(cacheKey);
    if (cachedEntry && cachedEntry.expiry > now) {
      console.log(`[MemoryCache] キャッシュヒット: ${cacheKey}`);
      return cachedEntry.data;
    }

    console.log(`[MemoryCache] キャッシュミス: ${cacheKey}`);

    // 最新の診断結果を取得
    const score: MBTIScore | null = await getLatestDiagnosisResult(userId);
    if (!score) {
      return null; // データが見つからない場合
    }

    // スコアを診断結果に変換
    const result = convertScoreToDiagnosisResult(score);

    // キャッシュに保存（10分間有効）
    memoryCache.set(cacheKey, { data: result, expiry: now + 10 * 60 * 1000 });
    console.log(`[MemoryCache] キャッシュ更新: ${cacheKey}`);

    return result;
  } catch (error) {
    console.error("[MemoryCache] キャッシュ処理中にエラーが発生しました:", error);
    return null; // エラーが発生した場合、nullを返して続行
  }
}
