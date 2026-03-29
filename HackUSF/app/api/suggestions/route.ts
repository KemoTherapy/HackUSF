import Anthropic from "@anthropic-ai/sdk"
import type { Language, CefrLevel } from "@/lib/types"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const MAX_WORDS: Record<CefrLevel, number> = {
  A1: 5,
  A2: 8,
  B1: 12,
  B2: 15,
  C1: 20,
  C2: 25,
}

export async function POST(request: Request) {
  try {
    const { messages, language, cefrLevel } = await request.json() as {
      messages: { role: "user" | "assistant"; content: string }[]
      language: Language
      cefrLevel: CefrLevel
    }

    const langName = language === "spanish" ? "Spanish" : "French"
    const maxWords = MAX_WORDS[cefrLevel] ?? 10
    const lastAiMessage = [...messages].reverse().find((m) => m.role === "assistant")?.content ?? ""

    const prompt = `You are helping a ${langName} language learner at CEFR level ${cefrLevel}.

The AI conversation partner just said:
"${lastAiMessage}"

Suggest 3 short phrases the learner could say in response. Rules:
- Write ONLY in ${langName} — no English
- Each phrase must be max ${maxWords} words
- Make them natural, varied, and appropriate for ${cefrLevel} level
- Return ONLY a JSON array, nothing else: ["phrase1", "phrase2", "phrase3"]`

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      messages: [{ role: "user", content: prompt }],
    })

    const raw = response.content[0].type === "text" ? response.content[0].text.trim() : "[]"

    // Extract JSON array from response
    const match = raw.match(/\[[\s\S]*\]/)
    const suggestions: string[] = match ? JSON.parse(match[0]) : []

    return Response.json({ suggestions: suggestions.slice(0, 3) })
  } catch (error) {
    console.error("Suggestions error:", error)
    return Response.json({ suggestions: [] })
  }
}
