import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MBTIScore, MBTIBias } from "../../types"; // 型定義を適宜変更
import { getMBTIBias } from "../../utils/mbti/mbtiUtils"; // util関数をインポート

export function MBTITransitionChart() {
  // 指標ごとの色を設定
  const colors: Record<keyof MBTIBias, string> = {
    EvsI: "#81D8D0", // 外向-内向
    SvsN: "#F6CEB4", // 感覚-直観
    TvsF: "#FAD4E0", // 思考-感情
    JvsP: "#CDE7F4", // 判断-知覚
  };

  // 元データ（MBTIScore）
  const rawData: Array<{ date: string } & MBTIScore> = [
    { date: "23-01-01", E: 45, I: 55, S: 50, N: 50, T: 55, F: 45, J: 60, P: 40 },
    { date: "23-02-01", E: 55, I: 45, S: 50, N: 50, T: 55, F: 45, J: 55, P: 45 },
    { date: "23-03-01", E: 65, I: 35, S: 52, N: 48, T: 62, F: 38, J: 58, P: 42 },
    { date: "23-04-01", E: 52, I: 48, S: 60, N: 40, T: 70, F: 30, J: 68, P: 32 },
    { date: "23-05-01", E: 70, I: 30, S: 55, N: 45, T: 62, F: 38, J: 65, P: 35 },
    { date: "23-06-01", E: 60, I: 40, S: 50, N: 50, T: 55, F: 45, J: 62, P: 38 },
    { date: "23-07-01", E: 57, I: 43, S: 62, N: 38, T: 68, F: 32, J: 67, P: 33 },
    { date: "23-08-01", E: 72, I: 28, S: 50, N: 50, T: 72, F: 28, J: 63, P: 37 },
    { date: "23-09-01", E: 50, I: 50, S: 48, N: 52, T: 60, F: 40, J: 58, P: 42 },
    { date: "23-10-01", E: 68, I: 32, S: 54, N: 46, T: 75, F: 25, J: 70, P: 30 },
    { date: "23-11-01", E: 55, I: 45, S: 52, N: 48, T: 65, F: 35, J: 60, P: 40 },
    { date: "23-12-01", E: 48, I: 52, S: 58, N: 42, T: 67, F: 33, J: 62, P: 38 },
  ];

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
