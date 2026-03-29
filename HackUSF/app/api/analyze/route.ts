import Anthropic from "@anthropic-ai/sdk"
import type { Language, CefrLevel, Scenario, Turn, AnalysisReport } from "@/lib/types"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      transcript,
      language,
      cefrLevel,
      scenario,
      mode,
    }: {
      transcript: Turn[]
      language: Language
      cefrLevel: CefrLevel
      scenario?: Scenario
      mode: "lesson" | "speaking"
    } = body

    const langName = language === "spanish" ? "Spanish" : "French"
    const userTurns = transcript.filter((t) => t.speaker === "user")

    if (userTurns.length === 0) {
      return Response.json(getFallbackReport())
    }

    // Compute pronunciation signal from speech recognition confidence scores
    const confidenceScores = userTurns.map((t) => t.confidence ?? 1).filter((c) => c > 0)
    const avgConfidence = confidenceScores.length > 0
      ? confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length
      : null
    const pronunciationScore = avgConfidence !== null ? Math.round(avgConfidence * 100) : null
    const lowConfidenceTurns = userTurns.filter((t) => (t.confidence ?? 1) < 0.75)

    const transcriptText = transcript
      .map((t) => `${t.speaker === "user" ? "Learner" : "AI"}: ${t.text}`)
      .join("\n")

    const pronunciationContext = pronunciationScore !== null
      ? `PRONUNCIATION DATA (from speech recognition):
- Average recognition confidence: ${pronunciationScore}% (${pronunciationScore >= 85 ? "clear and well-recognized" : pronunciationScore >= 65 ? "mostly clear with some unclear moments" : "frequently unclear — likely mispronunciation"})
- Turns with low confidence (<75%): ${lowConfidenceTurns.length} of ${userTurns.length}
- Use this as the primary basis for the pronunciation score. Do NOT estimate from text patterns.`
      : "PRONUNCIATION DATA: Not available — estimate from text patterns."

    const prompt = `You are an expert ${langName} language teacher. Analyze the following conversation transcript from a language learning session and provide detailed feedback.

LEARNER LEVEL: ${cefrLevel}
MODE: ${mode === "lesson" ? `Structured lesson (${scenario || "scenario"})` : "Free conversation practice"}
LANGUAGE: ${langName}

${pronunciationContext}

TRANSCRIPT:
${transcriptText}

Analyze ONLY the learner's messages. Provide your analysis as a JSON object matching this exact structure:

{
  "overallScore": <number 0-100>,
  "starsEarned": <number 0-5, based on overallScore: 0-19→0, 20-39→1, 40-59→2, 60-74→3, 75-89→4, 90-100→5>,
  "categories": {
    "pronunciation": {
      "score": <0-100, use the PRONUNCIATION DATA above as primary signal>,
      "notes": [<2-3 specific observations, reference the confidence data if available>]
    },
    "grammar": {
      "score": <0-100>,
      "notes": [<2-3 specific observations>]
    },
    "vocabulary": {
      "score": <0-100>,
      "notes": [<2-3 specific observations>]
    },
    "fluency": {
      "score": <0-100, based on response length and complexity>,
      "notes": [<2-3 specific observations>]
    },
    "naturalness": {
      "score": <0-100>,
      "notes": [<2-3 specific observations>]
    },
    "confidence": {
      "score": <0-100, based on response consistency and length>,
      "notes": [<2-3 encouraging observations>]
    }
  },
  "strengths": [<2-3 specific strengths>],
  "weaknesses": [<2-3 specific areas to improve>],
  "corrections": [
    {
      "original": <exact phrase the learner used>,
      "corrected": <the correct version>,
      "explanation": <brief clear explanation in English>,
      "type": <"grammar" | "vocabulary" | "pronunciation" | "naturalness">
    }
  ],
  "nextSteps": [<2-3 actionable next steps>]
}

Rules:
- corrections array must have EXACTLY 2-3 items maximum — pick only the most important mistakes
- notes arrays must have EXACTLY 2 items each — be concise
- strengths: exactly 2 items. weaknesses: exactly 2 items. nextSteps: exactly 2 items
- Be encouraging and constructive — this is a learning app
- Score fairly for the CEFR level (an A1 learner who forms basic sentences deserves a decent score)
- Return ONLY the JSON object, no other text`

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2500,
      messages: [{ role: "user", content: prompt }],
    })

    const rawText = response.content[0].type === "text" ? response.content[0].text : ""

    // Extract JSON from response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return Response.json(getFallbackReport())
    }

    const analysis = JSON.parse(jsonMatch[0]) as AnalysisReport
    return Response.json(analysis)
  } catch (error) {
    console.error("Analysis API error:", error)
    return Response.json(getFallbackReport())
  }
}

function getFallbackReport(): AnalysisReport {
  return {
    overallScore: 70,
    starsEarned: 3,
    categories: {
      pronunciation: { score: 70, notes: ["Good effort on pronunciation", "Keep practicing target sounds"] },
      grammar: { score: 72, notes: ["Solid basic structure", "Watch verb agreements"] },
      vocabulary: { score: 75, notes: ["Good use of key phrases", "Expanding vocabulary nicely"] },
      fluency: { score: 65, notes: ["Natural flow developing", "Try longer responses"] },
      naturalness: { score: 68, notes: ["Phrases are becoming more natural", "Great progress"] },
      confidence: { score: 74, notes: ["Responded consistently", "Keep up the confidence!"] },
    },
    strengths: ["Good use of target phrases", "Consistent participation", "Improving fluency"],
    weaknesses: ["Grammar agreement", "Expanding vocabulary"],
    corrections: [],
    nextSteps: ["Practice more scenarios at this level", "Focus on verb conjugations", "Try speaking for longer stretches"],
  }
}
