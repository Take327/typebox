import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MBTIScore, MBTIBias } from "../../types"; // 型定義を適宜変更
import { getMBTIBias } from "../../utils/mbti/mbtiUtils"; // util関数をインポート

export function MBTITransitionChart({ rawData }: { rawData: Array<{ date: string } & MBTIScore> }) {
  // 指標ごとの色を設定
  const colors: Record<keyof MBTIBias, string> = {
    EvsI: "#81D8D0", // 外向-内向
    SvsN: "#F6CEB4", // 感覚-直観
    TvsF: "#FAD4E0", // 思考-感情
    JvsP: "#CDE7F4", // 判断-知覚
  };

  // `getMBTIBias` を使ってスコア差（バイアス）データを生成
  const biasData = rawData.map(({ date, ...scores }) => ({
    date,
    ...getMBTIBias(scores),
  }));

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* 親コンテナのスタイルを調整 */}
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={biasData}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis domain={[-100, 100]} tickMargin={8} />
          <Tooltip />
          {["EvsI", "SvsN", "TvsF", "JvsP"].map((key) => (
            <Line
              key={key}
              dataKey={key}
              type="monotone"
              stroke={colors[key as keyof MBTIBias]} // 型安全に色を取得
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
