import Anthropic from "@anthropic-ai/sdk"
import type { Language, Region, CefrLevel, Scenario } from "@/lib/types"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const DIALECT_MAP: Record<Region, string> = {
  mexico:        "Mexican Spanish — use Mexican vocabulary, expressions, and a warm friendly tone",
  spain:         "Castilian Spanish — use vosotros, Peninsular vocabulary and pronunciation conventions",
  latin_america: "General Latin American Spanish — neutral accent, widely understood across the region",
  france:        "Parisian French — standard French as spoken in France",
  quebec:        "Québécois French — Canadian French, warm and conversational",
}

const CEFR_INSTRUCTIONS: Record<CefrLevel, string> = {
  A1: "ABSOLUTE BEGINNER. Short simple sentences. Present tense only. Use only the most basic 200 words — greetings, numbers, food, colors, yes/no. ONE question per reply maximum. Speak naturally but very simply. Be warm and encouraging.",
  A2: "ELEMENTARY. Short sentences. Present and simple past tense. Common everyday vocabulary. One question per reply.",
  B1: "INTERMEDIATE. Natural clear sentences. Mix tenses. Slightly broader vocabulary. Encourage the learner to give longer answers.",
  B2: "UPPER INTERMEDIATE. Speak naturally. Occasional idioms. Richer vocabulary. Expect and model complex sentences.",
  C1: "ADVANCED. Fully natural speech. Rich vocabulary, idioms, complex structures. Push for nuanced expression.",
  C2: "MASTERY. Speak exactly as a native speaker. Use all idioms, cultural references, literary vocabulary.",
}

const SCENARIO_ROLES: Record<Scenario, string> = {
  restaurant:  "You are a friendly waiter or waitress at a restaurant.",
  directions:  "You are a helpful local person on the street giving directions.",
  coffee_shop: "You are a barista working at a coffee shop.",
  hotel:       "You are a professional hotel receptionist at the front desk.",
}

const OUTPUT_RULES = `
CRITICAL OUTPUT RULES — follow these exactly:
- Write ONLY spoken words. Nothing else.
- NO asterisks, no stage directions, no action descriptions like *smiles* or *nods*
- NO emoji of any kind
- NO parentheses with English translations or explanations
- NO markdown formatting of any kind — no bold, no italics, no bullet points
- Your response will be read aloud by a text-to-speech engine. Write exactly what should be spoken and nothing else.
- If you need to include a hint, speak it naturally as part of the sentence in the target language only`

function buildSystemPrompt(params: {
  language: Language
  region: Region
  cefrLevel: CefrLevel
  mode: "lesson" | "speaking"
  scenario?: Scenario
  topic?: string
}): string {
  const { language, region, cefrLevel, mode, scenario, topic } = params
  const langName = language === "spanish" ? "Spanish" : "French"
  const dialect = DIALECT_MAP[region]
  const cefrGuide = CEFR_INSTRUCTIONS[cefrLevel]

  if (mode === "lesson" && scenario) {
    const role = SCENARIO_ROLES[scenario]
    return `You are roleplaying as a character in a ${langName} language lesson for an English-speaking learner.

YOUR CHARACTER: ${role}
DIALECT: ${dialect}
LEARNER LEVEL: ${cefrGuide}

CONVERSATION RULES:
- Speak ONLY in ${langName} — never switch to English
- Stay fully in character throughout the scenario
- Keep each reply to 1 to 3 sentences maximum so the learner can respond often
- If the learner says something in English, respond in ${langName} and model the phrase they needed
- Do not correct mistakes mid-conversation — just continue naturally
- Be warm, patient, and encouraging through your tone alone
- If the learner seems stuck, give a very short natural hint embedded in your reply in ${langName}
${OUTPUT_RULES}`
  }

  return `You are a friendly native ${langName} speaker having a real conversation with an English-speaking learner.

DIALECT: ${dialect}
LEARNER LEVEL: ${cefrGuide}
TOPIC: ${topic || "open conversation"}

CONVERSATION RULES:
- Speak ONLY in ${langName} — never switch to English
- Keep each reply to 2 to 4 sentences maximum — this is a conversation, not a lesson
- End every reply with a natural follow-up question to keep the conversation flowing
- If the learner uses English, respond in ${langName} and naturally model the phrase they needed
- Do not correct grammar mid-conversation — just continue naturally and model correct usage
- Be genuinely warm, curious, and interested in what the learner says
${OUTPUT_RULES}`
}

// Strip any markdown/artifacts that slip through before streaming
function sanitizeForSpeech(text: string): string {
  return text
    .replace(/\*[^*]*\*/g, "")           // remove *stage directions* or *bold*
    .replace(/[*_`#~]/g, "")             // remove leftover markdown chars
    // Remove emoji using explicit ranges — avoids matching digits (Unicode Emoji property includes 0-9)
    .replace(/[\u{1F300}-\u{1FFFF}]/gu, "")
    .replace(/[\u{2600}-\u{27BF}]/gu, "")
    .replace(/\s{2,}/g, " ")             // collapse extra spaces
    .trim()
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

    // Collect full text, sanitize, then stream clean output
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        let buffer = ""
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            buffer += chunk.delta.text
          }
        }
        const clean = sanitizeForSpeech(buffer)
        controller.enqueue(encoder.encode(clean))
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
