import Anthropic from "@anthropic-ai/sdk"
import type { Language } from "@/lib/types"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      exerciseType,
      userAnswer,
      correctAnswer,
      prompt,
      language,
    }: {
      exerciseType: "comprehension" | "fill_blank" | "translation"
      userAnswer: string
      correctAnswer: string
      prompt: string
      language: Language
    } = body

    // For comprehension and fill_blank, exact match is sufficient
    if (exerciseType === "comprehension" || exerciseType === "fill_blank") {
      const correct = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
      return Response.json({
        correct,
        correctAnswer,
        explanation: correct ? "Correct!" : `The correct answer is: "${correctAnswer}"`,
      })
    }

    // For translation, use Claude to semantically check the answer
    const langName = language === "spanish" ? "Spanish" : "French"
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `Check if this ${langName} translation is correct or acceptable.

Original prompt: "${prompt}"
Expected answer: "${correctAnswer}"
Learner's answer: "${userAnswer}"

Is the learner's answer correct or acceptable (same meaning, maybe different phrasing)?

Respond with JSON only:
{
  "correct": <true or false>,
  "explanation": <brief feedback in English, 1 sentence, encouraging if close>
}`,
        },
      ],
    })

    const rawText = response.content[0].type === "text" ? response.content[0].text : ""
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      // Fallback to simple string comparison
      const correct = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
      return Response.json({ correct, correctAnswer, explanation: correct ? "Correct!" : `Expected: "${correctAnswer}"` })
    }

    const result = JSON.parse(jsonMatch[0])
    return Response.json({ ...result, correctAnswer })
  } catch (error) {
    console.error("Check answer API error:", error)
    return Response.json({ correct: false, correctAnswer: "", explanation: "Could not check answer." }, { status: 500 })
  }
}
