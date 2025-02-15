import { NextRequest, NextResponse } from "next/server";
import openai from "@/utils//openai/openai";

export const POST = async (req: NextRequest) => {
  try {
    const { members } = await req.json();

    const prompt =
      `次のグループメンバーのMBTIの関係性を分析してください。\n\n` +
      members.map((m: any) => `- ${m.user_name}: ${m.mbti_type}`).join("\n") +
      `\n\nどのような相性なのかを簡潔に500文字以内で説明してください。`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    });

    return NextResponse.json({ analysis: response.choices[0].message.content });
  } catch (error) {
    console.error("AI診断エラー:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
