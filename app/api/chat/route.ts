import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
  try {
    const { message, conversationHistory } = await req.json();

    const model = genAi.getGenerativeModel({ model: "gemini-2.5-flash" })

    let contextPrompt = "";

    if (conversationHistory && conversationHistory.length > 0) {
      contextPrompt = "Previous conversation:\n";
      conversationHistory.forEach((msg: any) => {
        if (msg.role === "user") {
          contextPrompt += `Human: ${msg.text}\n`;
        } else if (msg.role === "assistant" && msg.text !== "...") {
          contextPrompt += `Assistant: ${msg.text}\n`;
        }
      });
      contextPrompt += `\nHuman: ${message}\nAssistant: `;
    } else {
      contextPrompt = message;
    }

    const result = await model.generateContent(contextPrompt);
    const text = result.response.text();

    return NextResponse.json({ success: true, text: text });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
