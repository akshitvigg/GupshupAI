import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
export async function POST(req: Request) {

  try {
    const { message } = await req.json();
    const model = genAi.getGenerativeModel({ model: "gemini-2.5-flash" })
    const result = await model.generateContent(message)
    const text = result.response.text();

    return NextResponse.json({ success: true, text: text })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
