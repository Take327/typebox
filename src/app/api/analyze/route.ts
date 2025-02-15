import { NextRequest, NextResponse } from "next/server";
import openai from "@/utils//openai/openai";

export const POST = async (req: NextRequest) => {
  try {
    const { members } = await req.json();

    const prompt =
      `次のグループメンバーのMBTIの関係性を分析してください。\n\n` +
      members.map((m: any) => `- ${m.user_name}: ${m.mbti_type}`).join("\n") +
      `\n\nどのような相性なのかを簡潔に300文字以内で説明してください。`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // gpt-4 → gpt-3.5-turbo に変更
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });

    return NextResponse.json({ analysis: response.choices[0].message.content });
  } catch (error) {
    console.error("AI診断エラー:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
