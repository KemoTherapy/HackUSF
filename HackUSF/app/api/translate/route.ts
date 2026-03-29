import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  try {
    const { text, fromLanguage }: { text: string; fromLanguage: string } = await request.json()

    if (!text?.trim()) {
      return Response.json({ translation: "" })
    }

    const langName = fromLanguage === "french" ? "French" : "Spanish"

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `Translate the following ${langName} text to English. Return only the translation — no explanation, no quotes, nothing else.\n\n${text}`,
        },
      ],
    })

    const translation = message.content[0].type === "text" ? message.content[0].text.trim() : ""
    return Response.json({ translation })
  } catch (error) {
    console.error("Translate API error:", error)
    return Response.json({ translation: "" }, { status: 500 })
  }
}
