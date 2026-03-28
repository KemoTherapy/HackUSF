import Anthropic from "@anthropic-ai/sdk"
import type { Language, Region, CefrLevel, Scenario } from "@/lib/types"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const DIALECT_MAP: Record<Region, string> = {
  mexico: "Mexican Spanish (Latin American accent, use Mexican vocabulary and expressions)",
  spain: "Castilian Spanish (European Spanish, use vosotros, Peninsular vocabulary)",
  latin_america: "General Latin American Spanish (neutral accent, widely understood)",
  france: "Parisian French (standard French)",
  quebec: "Québécois French (Canadian French, may use some local expressions)",
}

const CEFR_INSTRUCTIONS: Record<CefrLevel, string> = {
  A1: "The learner is an ABSOLUTE BEGINNER. Use extremely simple sentences (5-8 words max). Speak slowly. Repeat key words. Use only present tense. Be very encouraging and patient.",
  A2: "The learner is ELEMENTARY level. Use simple sentences. Stick to common everyday vocabulary. Occasional simple past tense is okay. Be warm and supportive.",
  B1: "The learner is INTERMEDIATE. Use natural but clear sentences. Mix tenses appropriately. Introduce slightly more complex vocabulary. Encourage longer responses.",
  B2: "The learner is UPPER INTERMEDIATE. Speak naturally. Use idiomatic expressions occasionally. Expect more complex responses. Provide subtle corrections.",
  C1: "The learner is ADVANCED. Speak fully naturally with rich vocabulary. Use idioms and complex structures. Push for nuanced expression.",
  C2: "The learner is near-NATIVE level. Speak exactly as a native speaker would. Use all idiomatic expressions, complex grammar, cultural references.",
}

const SCENARIO_ROLES: Record<Scenario, string> = {
  restaurant: "You are a friendly waiter/waitress at a restaurant. Stay in character throughout.",
  directions: "You are a helpful local person on the street giving directions.",
  coffee_shop: "You are a barista at a coffee shop.",
  hotel: "You are a professional hotel receptionist at check-in.",
}

function buildSystemPrompt(params: {
  language: Language
  region: Region
  cefrLevel: CefrLevel
  mode: "lesson" | "speaking"
  scenario?: Scenario
  topic?: string
}): string {
  const { language, region, cefrLevel, mode, scenario, topic } = params
  const dialect = DIALECT_MAP[region]
  const cefrGuide = CEFR_INSTRUCTIONS[cefrLevel]

  if (mode === "lesson" && scenario) {
    const role = SCENARIO_ROLES[scenario]
    return `You are an AI language tutor helping an English speaker learn ${language === "spanish" ? "Spanish" : "French"}.

DIALECT: ${dialect}

YOUR ROLE IN THIS LESSON: ${role}

LEARNER LEVEL: ${cefrGuide}

RULES:
- Respond ONLY in ${language === "spanish" ? "Spanish" : "French"} unless the learner is completely stuck
- Stay in your character role throughout the scenario
- Keep responses SHORT (1-3 sentences) so the learner gets to practice more
- Do NOT correct errors mid-conversation — save corrections for after
- If the learner uses English, gently encourage them in the target language: "(Try saying that in ${language === "spanish" ? "Spanish" : "French"}!)"
- Be warm, patient, and encouraging
- If the learner struggles, give them a hint phrase in parentheses
- Adapt complexity to the CEFR level above`
  }

  // Speaking / freeform mode
  return `You are a friendly AI conversation partner helping an English speaker practice ${language === "spanish" ? "Spanish" : "French"}.

DIALECT: ${dialect}

LEARNER LEVEL: ${cefrGuide}

TOPIC: ${topic || "Open conversation"}

RULES:
- Respond ONLY in ${language === "spanish" ? "Spanish" : "French"} unless the learner is completely lost
- Keep responses SHORT (2-4 sentences) — this is a conversation, not a lecture
- Ask a follow-up question at the end of each response to keep the conversation going
- Do NOT correct grammar mid-conversation — just model correct usage naturally
- If the learner uses English, gently encourage them: "(Try that in ${language === "spanish" ? "Spanish" : "French"}!)"
- Be warm, encouraging, and genuinely interested
- Adapt complexity to the CEFR level above`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      messages,
      language,
      region,
      cefrLevel,
      mode,
      scenario,
      topic,
    }: {
      messages: { role: "user" | "assistant"; content: string }[]
      language: Language
      region: Region
      cefrLevel: CefrLevel
      mode: "lesson" | "speaking"
      scenario?: Scenario
      topic?: string
    } = body

    const systemPrompt = buildSystemPrompt({ language, region, cefrLevel, mode, scenario, topic })

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      system: systemPrompt,
      messages,
    })

    // Stream the response back as plain text
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text))
          }
        }
        controller.close()
      },
    })

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json({ error: "Failed to get response" }, { status: 500 })
  }
}
